// Edge Function: chariow-webhook
// Reçoit les notifications "Pulse" de Chariow (ex: successful.sale) et met à
// jour les commandes/paiements en conséquence. Vérifie la signature HMAC
// pour s'assurer que la requête vient bien de Chariow.
//
// Déploiement : supabase functions deploy chariow-webhook --no-verify-jwt
// Secret requis : supabase secrets set CHARIOW_PULSE_SECRET=whsec_xxx
// URL à configurer dans Chariow (Automations > Pulses) :
//   https://VOTRE_PROJET.supabase.co/functions/v1/chariow-webhook

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const CHARIOW_PULSE_SECRET = Deno.env.get("CHARIOW_PULSE_SECRET")!
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

async function verifySignature(rawBody: string, signatureHeader: string | null) {
  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) return false
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(CHARIOW_PULSE_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody))
  const expectedHex = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
  const expected = `sha256=${expectedHex}`
  if (expected.length !== signatureHeader.length) return false
  // comparaison en temps constant
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signatureHeader.charCodeAt(i)
  }
  return diff === 0
}

Deno.serve(async (req) => {
  const rawBody = await req.text()
  const signature = req.headers.get("x-chariow-signature")
  const deliveryId = req.headers.get("x-pulse-delivery-id")
  const event = req.headers.get("x-pulse-event")

  const valid = await verifySignature(rawBody, signature)
  if (!valid) {
    return new Response("Signature invalide", { status: 401 })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  // Anti-doublon : on ignore si ce delivery_id a déjà été traité
  if (deliveryId) {
    const { error: insertError } = await supabase
      .from("chariow_webhook_events")
      .insert({ delivery_id: deliveryId, event })
    if (insertError) {
      // déjà présent = déjà traité
      return new Response("OK (déjà traité)", { status: 200 })
    }
  }

  const payload = JSON.parse(rawBody)
  const metadata = payload?.data?.sale?.custom_metadata || payload?.data?.custom_metadata
  const orderId = metadata?.order_id
  const unitId = metadata?.unit_id

  if (event === "successful.sale" && orderId && unitId) {
    await supabase
      .from("chariow_order_units")
      .update({ status: "payé" })
      .eq("id", unitId)

    // Si toutes les unités de la commande sont payées, on marque la commande payée
    const { data: units } = await supabase
      .from("chariow_order_units")
      .select("status")
      .eq("order_id", orderId)

    const allPaid = units && units.length > 0 && units.every((u) => u.status === "payé")
    if (allPaid) {
      await supabase.from("orders").update({ status: "payée" }).eq("id", orderId)
      await supabase
        .from("payments")
        .update({ status: "payé", paid_at: new Date().toISOString() })
        .eq("order_id", orderId)
    }
  }

  if (event === "failed.payment" && unitId) {
    await supabase.from("chariow_order_units").update({ status: "échoué" }).eq("id", unitId)
  }

  return new Response("OK", { status: 200 })
})
// Edge Function: chariow-checkout
// Reçoit les infos d'un article + client, appelle l'API Chariow avec la clé
// secrète (jamais exposée au navigateur), et renvoie l'URL de paiement.
//
// Déploiement : supabase functions deploy chariow-checkout
// Secret requis : supabase secrets set CHARIOW_API_KEY=sk_live_xxx

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const CHARIOW_API_KEY = Deno.env.get("CHARIOW_API_KEY")!
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const {
      chariow_product_id,
      email,
      first_name,
      last_name,
      phone_number,
      phone_country_code,
      order_id,
      unit_id,
      redirect_url,
    } = body

    if (!chariow_product_id || !email || !order_id || !unit_id) {
      return new Response(JSON.stringify({ error: "Champs requis manquants." }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const chariowRes = await fetch("https://api.chariow.com/v1/checkout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CHARIOW_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: chariow_product_id,
        email,
        first_name,
        last_name,
        phone: { number: phone_number, country_code: phone_country_code || "BJ" },
        redirect_url,
        custom_metadata: { order_id, unit_id },
      }),
    })

    const data = await chariowRes.json()

    if (!chariowRes.ok) {
      return new Response(JSON.stringify({ error: data.message || "Erreur Chariow", details: data }), {
        status: chariowRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // On enregistre l'ID de vente Chariow sur l'unité de commande correspondante
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    await supabase
      .from("chariow_order_units")
      .update({
        chariow_sale_id: data?.data?.purchase?.id || null,
      })
      .eq("id", unit_id)

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
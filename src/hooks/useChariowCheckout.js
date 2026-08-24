import { supabase } from '../lib/supabaseClient'

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chariow-checkout`
const STORAGE_KEY = 'chanceliere_chariow_queue'

// Construit une "unité" par exemplaire d'article (une paire = une unité,
// car Chariow ne gère pas les quantités). Nécessite que chaque article ait
// un chariow_product_id renseigné par l'admin.
export function buildChariowUnits(cartItems) {
  const units = []
  for (const item of cartItems) {
    if (!item.chariow_product_id) return { error: `L'article "${item.name}" n'est pas encore configuré pour le paiement en ligne.` }
    for (let i = 0; i < item.quantity; i++) {
      units.push({
        product_id: item.id,
        chariow_product_id: item.chariow_product_id,
        name: item.name,
        amount: item.price,
      })
    }
  }
  return { units }
}

export async function createOrderUnits({ orderId, units }) {
  const rows = units.map((u) => ({
    order_id: orderId,
    product_id: u.product_id,
    chariow_product_id: u.chariow_product_id,
    amount: u.amount,
  }))
  const { data, error } = await supabase.from('chariow_order_units').insert(rows).select()
  if (error) throw error
  return data
}

export async function initiateChariowCheckout({ unit, customer, orderId }) {
  const { data: { session } } = await supabase.auth.getSession()
  const res = await fetch(FUNCTIONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify({
      chariow_product_id: unit.chariow_product_id,
      email: customer.email,
      first_name: customer.first_name,
      last_name: customer.last_name,
      phone_number: customer.phone_number,
      phone_country_code: customer.phone_country_code || 'BJ',
      order_id: orderId,
      unit_id: unit.id,
      redirect_url: `${window.location.origin}/paiement-chariow-retour?order=${orderId}`,
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erreur lors de la création du paiement Chariow.')
  return data
}

export async function getDeliveryInfo(orderId) {
  const { data } = await supabase.from('deliveries').select('*').eq('order_id', orderId).single()
  return data
}

export function saveQueue(orderId, queue) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ orderId, queue }))
}
export function loadQueue() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
export function clearQueue() {
  localStorage.removeItem(STORAGE_KEY)
}
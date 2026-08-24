import { supabase } from '../lib/supabaseClient'

export async function createOrder({ userId, items, total }) {
  const { data: order, error } = await supabase
    .from('orders')
    .insert({ user_id: userId, total_amount: total, status: 'en_attente_livraison' })
    .select()
    .single()
  if (error) throw error

  const orderItems = items.map((i) => ({
    order_id: order.id,
    product_id: i.id,
    size: i.size,
    quantity: i.quantity,
    unit_price: i.price,
  }))
  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) throw itemsError

  return order
}

export async function saveDelivery({ orderId, delivery }) {
  const { error } = await supabase.from('deliveries').insert({ order_id: orderId, ...delivery })
  if (error) throw error
  await supabase.from('orders').update({ status: 'en_attente_paiement' }).eq('id', orderId)
  await supabase.rpc('create_order_notifications', { p_order_id: orderId })
}

export async function savePayment({ orderId, method, amount }) {
  const { error } = await supabase.from('payments').insert({
    order_id: orderId,
    method,
    amount,
    status: method === 'paiement_livraison' ? 'en_attente' : 'payé',
    paid_at: method === 'paiement_livraison' ? null : new Date().toISOString(),
  })
  if (error) throw error
  await supabase.from('orders').update({
    status: method === 'paiement_livraison' ? 'en_attente_livraison' : 'payée',
  }).eq('id', orderId)
}

export async function getUserOrders(userId) {
  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name, image_url)), deliveries(*), payments(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data || []
}
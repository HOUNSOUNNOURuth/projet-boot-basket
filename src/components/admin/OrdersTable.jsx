import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function OrdersTable({ statuses }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    setLoading(true)
    let query = supabase
      .from('orders')
      .select('*, profiles(full_name, phone), order_items(quantity, unit_price, products(name)), deliveries(*)')
      .order('created_at', { ascending: false })
    if (statuses) query = query.in('status', statuses)
    const { data } = await query
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const updateStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    fetchOrders()
  }

  if (loading) return <p className="text-graphite text-sm">Chargement...</p>
  if (!orders.length) return <p className="text-graphite text-sm">Aucune commande.</p>

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="card p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-medium text-sm">#{o.id.slice(0, 8)} — {o.profiles?.full_name}</p>
              <p className="text-xs text-graphite">{o.deliveries?.[0]?.address}, {o.deliveries?.[0]?.city} · {o.profiles?.phone}</p>
              <p className="text-xs text-graphite">
                {new Date(o.created_at).toLocaleDateString('fr-FR')} à {new Date(o.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <span className="text-xs px-2 py-1 bg-mist rounded-full">{o.status}</span>
          </div>
          <ul className="text-sm text-graphite mb-2">
            {o.order_items?.map((it, i) => (
              <li key={i}>{it.quantity} × {it.products?.name} — {(it.quantity * it.unit_price).toLocaleString('fr-FR')} FCFA</li>
            ))}
          </ul>
          <div className="flex justify-between items-center">
            <p className="font-semibold text-sm">{o.total_amount?.toLocaleString('fr-FR')} FCFA</p>
            <select
              value={o.status}
              onChange={(e) => updateStatus(o.id, e.target.value)}
              className="border border-line rounded-lg text-xs px-2 py-1"
            >
              <option value="en_attente_livraison">En attente livraison</option>
              <option value="en_attente_paiement">En attente paiement</option>
              <option value="payée">Payée</option>
              <option value="livrée">Livrée</option>
              <option value="annulée">Annulée</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  )
}
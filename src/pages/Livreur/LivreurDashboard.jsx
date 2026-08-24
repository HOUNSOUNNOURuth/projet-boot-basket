import { useEffect, useState } from 'react'
import Header from '../../components/layout/Header'
import { supabase } from '../../lib/supabaseClient'

export default function LivreurDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [markingId, setMarkingId] = useState(null)

  const fetchOrders = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(quantity, unit_price, products(name)), deliveries(*), payments(method, status)')
      .in('status', ['en_attente_livraison', 'en_attente_paiement'])
      .order('created_at', { ascending: true })
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const handleDelivered = async (orderId) => {
    setMarkingId(orderId)
    const { error } = await supabase.rpc('mark_order_delivered', { p_order_id: orderId })
    if (!error) fetchOrders()
    setMarkingId(null)
  }

  return (
    <div className="min-h-screen">
      <Header search="" onSearchChange={() => {}} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display text-2xl font-semibold mb-6">Commandes à livrer</h1>

        {loading && <p className="text-graphite">Chargement...</p>}
        {!loading && orders.length === 0 && <p className="text-graphite">Aucune livraison en attente. 🎉</p>}

        <div className="space-y-4">
          {orders.map((o) => {
            const d = o.deliveries?.[0]
            return (
              <div key={o.id} className="card p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{d?.full_name}</p>
                    <p className="text-sm text-graphite">{d?.phone}</p>
                    <p className="text-sm text-graphite">{d?.address}, {d?.city}</p>
                    {d?.landmark && <p className="text-xs text-graphite">Repère : {d.landmark}</p>}
                    <p className="text-xs text-graphite mt-1">
                      Commande du {new Date(o.created_at).toLocaleDateString('fr-FR')} à {new Date(o.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-mist rounded-full">
                    {o.payments?.[0]?.method === 'paiement_livraison' ? 'À encaisser à la livraison' : 'Déjà payée'}
                  </span>
                </div>
                <ul className="text-sm text-graphite mb-3">
                  {o.order_items?.map((it, i) => (
                    <li key={i}>{it.quantity} × {it.products?.name}</li>
                  ))}
                </ul>
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{o.total_amount?.toLocaleString('fr-FR')} FCFA</p>
                  <button
                    disabled={markingId === o.id}
                    onClick={() => handleDelivered(o.id)}
                    className="btn-primary text-sm"
                  >
                    {markingId === o.id ? 'Validation...' : 'Marquer comme livrée'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
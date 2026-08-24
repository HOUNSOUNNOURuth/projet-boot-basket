import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function UnsettledOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('orders')
      .select('*, profiles(full_name, phone), payments(method, status)')
      .in('status', ['en_attente_livraison', 'en_attente_paiement'])
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data || [])
        setLoading(false)
      })
  }, [])

  const total = orders.reduce((s, o) => s + (o.total_amount || 0), 0)

  return (
    <div className="card p-5 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-display font-semibold">Commandes non réglées</h3>
        <span className="text-xs px-2 py-1 bg-mist rounded-full">{orders.length}</span>
      </div>

      {loading && <p className="text-graphite text-sm">Chargement...</p>}
      {!loading && orders.length === 0 && <p className="text-graphite text-sm">Aucune commande en attente de règlement. 🎉</p>}

      {!loading && orders.length > 0 && (
        <>
          <ul className="space-y-2 mb-4">
            {orders.map((o) => (
              <li key={o.id} className="flex justify-between text-sm border-b border-line/60 pb-2">
                <div>
                  <p className="font-medium">{o.profiles?.full_name || 'Client'}</p>
                  <p className="text-xs text-graphite">
                    {o.status === 'en_attente_livraison' ? 'En attente de livraison' : 'En attente de paiement'}
                    {o.payments?.[0]?.method ? ` · ${o.payments[0].method}` : ''}
                  </p>
                </div>
                <span className="font-medium">{o.total_amount?.toLocaleString('fr-FR')} FCFA</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between pt-2 border-t border-line">
            <span className="font-medium text-sm">Total en attente</span>
            <span className="font-display font-semibold">{total.toLocaleString('fr-FR')} FCFA</span>
          </div>
        </>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import Header from '../components/layout/Header'
import { useAuth } from '../context/AuthContext'
import { getUserOrders } from '../hooks/useOrders'

export default function OrderHistory() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getUserOrders(user.id).then((data) => {
      setOrders(data)
      setLoading(false)
    })
  }, [user])

  return (
    <div className="min-h-screen">
      <Header search="" onSearchChange={() => {}} />
      <div className="max-w-2xl mx-auto px-6 py-14">
        <h1 className="font-display text-2xl font-semibold mb-6">Mes commandes</h1>
        {loading && <p className="text-graphite">Chargement...</p>}
        {!loading && orders.length === 0 && <p className="text-graphite">Aucune commande pour le moment.</p>}
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="card p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Commande #{o.id.slice(0, 8)}</span>
                <span className="text-xs px-2 py-1 bg-mist rounded-full">{o.status}</span>
              </div>
              <p className="text-xs text-graphite mb-1">
                {new Date(o.created_at).toLocaleDateString('fr-FR')} à {new Date(o.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-sm text-graphite mb-1">{o.order_items?.length} article(s)</p>
              <p className="font-semibold">{o.total_amount?.toLocaleString('fr-FR')} FCFA</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
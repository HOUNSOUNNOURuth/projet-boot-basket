import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

function todayRange() {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  return { start: start.toISOString(), end: end.toISOString() }
}

export default function DailySalesReport() {
  const [lines, setLines] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { start, end } = todayRange()
    supabase
      .from('order_items')
      .select('quantity, unit_price, products(name), orders!inner(created_at, status)')
      .gte('orders.created_at', start)
      .lte('orders.created_at', end)
      .in('orders.status', ['payée', 'livrée'])
      .then(({ data }) => {
        const grouped = {}
        let sum = 0
        ;(data || []).forEach((row) => {
          const name = row.products?.name || 'Article'
          const amount = row.quantity * row.unit_price
          sum += amount
          if (!grouped[name]) grouped[name] = { name, quantity: 0, amount: 0 }
          grouped[name].quantity += row.quantity
          grouped[name].amount += amount
        })
        setLines(Object.values(grouped))
        setTotal(sum)
        setLoading(false)
      })
  }, [])

  return (
    <div className="card p-5 max-w-2xl">
      <h3 className="font-display font-semibold mb-4">Bilan des ventes du jour</h3>
      {loading && <p className="text-graphite text-sm">Calcul en cours...</p>}
      {!loading && lines.length === 0 && <p className="text-graphite text-sm">Aucune vente réglée aujourd'hui.</p>}
      {!loading && lines.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-graphite border-b border-line">
              <th className="py-2">Article</th>
              <th className="py-2">Quantité</th>
              <th className="py-2 text-right">Montant</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.name} className="border-b border-line/50">
                <td className="py-2">{l.name}</td>
                <td className="py-2">{l.quantity}</td>
                <td className="py-2 text-right">{l.amount.toLocaleString('fr-FR')} FCFA</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex justify-between mt-4 pt-4 border-t border-line">
        <span className="font-medium">Total de la journée</span>
        <span className="font-display text-lg font-semibold">{total.toLocaleString('fr-FR')} FCFA</span>
      </div>
    </div>
  )
}

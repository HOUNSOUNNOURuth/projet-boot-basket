import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { createOrder, saveDelivery } from '../../hooks/useOrders'

export default function DeliveryForm() {
  const { items, total, clearCart } = useCart()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    address: '',
    city: '',
    landmark: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const order = await createOrder({ userId: user.id, items, total })
      await saveDelivery({ orderId: order.id, delivery: form })
      navigate(`/paiement?order=${order.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <input required placeholder="Nom complet" value={form.full_name} onChange={update('full_name')} className="w-full border border-line rounded-lg px-4 py-2.5 text-sm" />
      <input required placeholder="Téléphone" value={form.phone} onChange={update('phone')} className="w-full border border-line rounded-lg px-4 py-2.5 text-sm" />
      <input required placeholder="Adresse" value={form.address} onChange={update('address')} className="w-full border border-line rounded-lg px-4 py-2.5 text-sm" />
      <input required placeholder="Ville" value={form.city} onChange={update('city')} className="w-full border border-line rounded-lg px-4 py-2.5 text-sm" />
      <input placeholder="Repère / indication" value={form.landmark} onChange={update('landmark')} className="w-full border border-line rounded-lg px-4 py-2.5 text-sm" />
      <textarea placeholder="Notes pour le livreur (optionnel)" value={form.notes} onChange={update('notes')} rows={2} className="w-full border border-line rounded-lg px-4 py-2.5 text-sm" />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button disabled={loading} className="btn-primary w-full">{loading ? 'Enregistrement...' : 'Continuer vers le paiement'}</button>
    </form>
  )
}

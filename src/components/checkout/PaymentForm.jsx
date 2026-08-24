import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { savePayment } from '../../hooks/useOrders'
import {
  buildChariowUnits,
  createOrderUnits,
  initiateChariowCheckout,
  saveQueue,
  getDeliveryInfo,
} from '../../hooks/useChariowCheckout'

const METHODS = [
  { id: 'chariow', label: 'Payer en ligne (Chariow — Mobile Money / Carte)' },
  { id: 'mobile_money', label: 'Mobile Money (manuel)' },
  { id: 'carte', label: 'Carte bancaire (manuel)' },
  { id: 'paiement_livraison', label: 'Paiement à la livraison' },
]

export default function PaymentForm() {
  const [params] = useSearchParams()
  const orderId = params.get('order')
  const { items, total, clearCart } = useCart()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [method, setMethod] = useState('chariow')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleClassicConfirm = async () => {
    setLoading(true)
    await savePayment({ orderId, method, amount: total })
    clearCart()
    navigate(`/confirmation?order=${orderId}`)
  }

  const handleChariowConfirm = async () => {
    setError(null)
    setLoading(true)
    try {
      const { units, error: unitsError } = buildChariowUnits(items)
      if (unitsError) {
        setError(unitsError)
        setLoading(false)
        return
      }

      const createdUnits = await createOrderUnits({ orderId, units })

      const delivery = await getDeliveryInfo(orderId)
      const nameSource = delivery?.full_name || profile?.full_name || 'Client'
      const [fullFirst, ...rest] = nameSource.split(' ')
      const phoneSource = (delivery?.phone || profile?.phone || '').replace(/\D/g, '')

      if (!phoneSource) {
        setError("Merci de renseigner un numéro de téléphone valide (retournez à l'étape livraison si besoin).")
        setLoading(false)
        return
      }

      const customer = {
        email: user.email,
        first_name: fullFirst,
        last_name: rest.join(' ') || 'Chancelière',
        phone_number: phoneSource,
        phone_country_code: 'BJ',
      }

      // On enregistre la file d'attente (les unités restantes) pour pouvoir
      // reprendre après chaque redirection vers Chariow.
      const queue = createdUnits.map((u) => ({ id: u.id, chariow_product_id: u.chariow_product_id }))
      saveQueue(orderId, queue.slice(1))

      const first = createdUnits[0]
      const result = await initiateChariowCheckout({
        unit: first,
        customer,
        orderId,
      })

      if (result?.data?.step === 'payment') {
        window.location.href = result.data.payment.checkout_url
      } else if (result?.data?.step === 'completed') {
        navigate(`/paiement-chariow-retour?order=${orderId}`)
      } else {
        setError(result?.data?.message || 'Réponse inattendue de Chariow.')
        setLoading(false)
      }
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleConfirm = () => {
    if (method === 'chariow') return handleChariowConfirm()
    return handleClassicConfirm()
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <p className="text-graphite text-sm mb-2">Montant à payer</p>
      <p className="text-3xl font-display font-semibold mb-6">{total.toLocaleString('fr-FR')} FCFA</p>

      <div className="space-y-2">
        {METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={`w-full text-left border rounded-lg px-4 py-3 text-sm ${method === m.id ? 'border-ink bg-mist' : 'border-line'}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {method === 'chariow' && items.length > 1 && (
        <p className="text-xs text-graphite bg-mist rounded-lg p-3">
          Votre panier contient {items.reduce((s, i) => s + i.quantity, 0)} article(s). Chariow traite un article à la fois :
          vous serez redirigé successivement pour chaque paiement jusqu'à ce que tout soit réglé.
        </p>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button disabled={loading} onClick={handleConfirm} className="btn-primary w-full mt-4">
        {loading ? 'Traitement...' : 'Confirmer le paiement'}
      </button>
    </div>
  )
}
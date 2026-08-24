import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../components/layout/Header'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { loadQueue, saveQueue, clearQueue, initiateChariowCheckout, getDeliveryInfo } from '../hooks/useChariowCheckout'

export default function PaymentChariowReturn() {
  const [params] = useSearchParams()
  const orderId = params.get('order')
  const { user, profile } = useAuth()
  const { clearCart } = useCart()
  const navigate = useNavigate()
  const [status, setStatus] = useState('checking') // checking | next | done | error
  const [error, setError] = useState(null)

  useEffect(() => {
    const run = async () => {
      const saved = loadQueue()

      if (!saved || saved.orderId !== orderId || saved.queue.length === 0) {
        // Plus rien dans la file : tous les articles sont passés en paiement.
        clearQueue()
        clearCart()
        setStatus('done')
        return
      }

      setStatus('next')
      const [nextUnit, ...rest] = saved.queue
      saveQueue(orderId, rest)

      try {
        const delivery = await getDeliveryInfo(orderId)
        const nameSource = delivery?.full_name || profile?.full_name || 'Client'
        const [fullFirst, ...lastRest] = nameSource.split(' ')
        const phoneSource = (delivery?.phone || profile?.phone || '').replace(/\D/g, '')

        const result = await initiateChariowCheckout({
          unit: nextUnit,
          customer: {
            email: user.email,
            first_name: fullFirst,
            last_name: lastRest.join(' ') || 'Chancelière',
            phone_number: phoneSource,
            phone_country_code: 'BJ',
          },
          orderId,
        })

        if (result?.data?.step === 'payment') {
          window.location.href = result.data.payment.checkout_url
        } else {
          // completed ou already_purchased : on passe au suivant automatiquement
          navigate(`/paiement-chariow-retour?order=${orderId}`, { replace: true })
        }
      } catch (err) {
        setError(err.message)
        setStatus('error')
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen">
      <Header search="" onSearchChange={() => {}} />
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        {status === 'checking' && <p className="text-graphite">Vérification du paiement...</p>}
        {status === 'next' && <p className="text-graphite">Redirection vers le paiement de l'article suivant...</p>}
        {status === 'error' && (
          <>
            <p className="text-red-600 mb-4">{error}</p>
            <Link to="/commandes" className="btn-outline inline-block">Voir mes commandes</Link>
          </>
        )}
        {status === 'done' && (
          <>
            <div className="w-16 h-16 rounded-full bg-ink text-paper flex items-center justify-center mx-auto mb-6 text-2xl">✓</div>
            <h1 className="font-display text-2xl font-semibold mb-3">Tous les paiements sont lancés</h1>
            <p className="text-graphite mb-8">
              La confirmation finale de votre commande arrive automatiquement dès que Chariow valide chaque paiement.
            </p>
            <Link to="/commandes" className="btn-primary inline-block">Voir mes commandes</Link>
          </>
        )}
      </div>
    </div>
  )
}
import { Link, useSearchParams } from 'react-router-dom'
import Header from '../components/layout/Header'

export default function OrderConfirmation() {
  const [params] = useSearchParams()
  return (
    <div className="min-h-screen">
      <Header search="" onSearchChange={() => {}} />
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-ink text-paper flex items-center justify-center mx-auto mb-6 text-2xl">✓</div>
        <h1 className="font-display text-2xl font-semibold mb-3">Commande confirmée</h1>
        <p className="text-graphite mb-1">Référence : {params.get('order')}</p>
        <p className="text-graphite mb-8">Merci pour votre achat. Vous recevrez une confirmation par téléphone.</p>
        <Link to="/" className="btn-primary inline-block">Retour à la boutique</Link>
      </div>
    </div>
  )
}

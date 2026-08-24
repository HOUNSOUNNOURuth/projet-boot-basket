import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import CartItem from './CartItem'

export default function CartDrawer() {
  const { items, total, isOpen, setIsOpen } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleContinue = () => {
    setIsOpen(false)
    if (!user) {
      navigate('/connexion?redirect=/livraison')
    } else {
      navigate('/livraison')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={() => setIsOpen(false)}>
      <div className="bg-paper w-full max-w-md h-full p-6 flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display text-xl font-semibold">Mon panier</h3>
          <button onClick={() => setIsOpen(false)} className="text-graphite hover:text-ink">✕</button>
        </div>

        {items.length === 0 ? (
          <p className="text-graphite text-sm flex-1">Votre panier est vide.</p>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3">
            {items.map((item) => <CartItem key={`${item.id}-${item.size}`} item={item} />)}
          </div>
        )}

        <div className="border-t border-line pt-4 mt-4">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Total</span>
            <span className="font-semibold text-lg">{total.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <button disabled={items.length === 0} onClick={handleContinue} className="btn-primary w-full disabled:opacity-40">
            Continuer
          </button>
        </div>
      </div>
    </div>
  )
}

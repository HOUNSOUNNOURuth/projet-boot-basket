import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Header from '../components/layout/Header'
import CartItem from '../components/cart/CartItem'

export default function Cart() {
  const { items, total, setIsOpen } = useCart()
  return (
    <div className="min-h-screen">
      <Header search="" onSearchChange={() => {}} />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-display text-2xl font-semibold mb-6">Mon panier</h1>
        {items.length === 0 ? (
          <p className="text-graphite">Votre panier est vide. <Link to="/" className="underline">Retour à la boutique</Link></p>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {items.map((i) => <CartItem key={`${i.id}-${i.size}`} item={i} />)}
            </div>
            <p className="text-lg font-semibold">Total : {total.toLocaleString('fr-FR')} FCFA</p>
          </>
        )}
      </div>
    </div>
  )
}

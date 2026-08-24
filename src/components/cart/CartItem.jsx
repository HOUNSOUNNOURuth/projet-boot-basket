import { useCart } from '../../context/CartContext'

export default function CartItem({ item }) {
  const { addToCart, decreaseQuantity, removeFromCart } = useCart()

  return (
    <div className="flex items-center gap-3 border border-line rounded-xl p-3">
      <div className="w-16 h-16 bg-mist rounded-lg overflow-hidden shrink-0">
        {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{item.name}</p>
        <p className="text-xs text-graphite">Taille {item.size || '-'}</p>
        <p className="text-sm font-semibold mt-1">{(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => decreaseQuantity(item.id, item.size)} className="w-7 h-7 border border-line rounded-full">-</button>
        <span className="text-sm w-4 text-center">{item.quantity}</span>
        <button onClick={() => addToCart(item, item.size)} className="w-7 h-7 border border-line rounded-full">+</button>
      </div>
      <button onClick={() => removeFromCart(item.id, item.size)} className="text-xs text-graphite hover:text-ink ml-2">
        Retirer
      </button>
    </div>
  )
}

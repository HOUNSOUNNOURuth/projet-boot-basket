import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import ProductModal from './ProductModal'

export default function ProductCard({ product }) {
  const { items, addToCart, removeFromCart } = useCart()
  const [modalOpen, setModalOpen] = useState(false)
  const defaultSize = product.sizes?.[0] || null

  const inCart = items.find((i) => i.id === product.id && i.size === defaultSize)

  return (
    <>
      <div className="card p-4 flex flex-col hover:shadow-lg transition-shadow">
        <div className="aspect-square bg-mist rounded-xl overflow-hidden mb-4 flex items-center justify-center">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-graphite text-sm">Pas d'image</span>
          )}
        </div>
        <p className="text-xs text-graphite mb-1">{product.brands?.name || 'Marque'}</p>
        <h3 className="font-display font-semibold mb-1 line-clamp-1">{product.name}</h3>
        <p className="font-semibold mb-4">{product.price?.toLocaleString('fr-FR')} FCFA</p>

        <button onClick={() => setModalOpen(true)} className="btn-ghost border border-line text-sm mb-2">
          Plus d'infos
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => addToCart(product, defaultSize)}
            className="btn-primary text-sm flex-1"
          >
            Ajouter au panier
          </button>
          {inCart && (
            <button
              onClick={() => removeFromCart(product.id, defaultSize)}
              className="btn-outline text-sm"
              title="Retirer du panier"
            >
              Retirer
            </button>
          )}
        </div>
      </div>

      <ProductModal product={product} open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}

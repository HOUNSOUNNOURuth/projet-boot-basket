import { useCart } from '../../context/CartContext'
import ReviewList from './ReviewList'
import { useState } from 'react'

export default function ProductModal({ product, open, onClose }) {
  const { addToCart } = useCart()
  const [size, setSize] = useState(product?.sizes?.[0] || null)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-paper rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-display text-2xl font-semibold">{product.name}</h3>
          <button onClick={onClose} className="text-graphite hover:text-ink">✕</button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-mist rounded-xl overflow-hidden">
            {product.image_url && <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />}
          </div>

          <div>
            <p className="text-sm text-graphite mb-2">{product.brands?.name} — {product.categories?.name}</p>
            <p className="text-2xl font-semibold mb-4">{product.price?.toLocaleString('fr-FR')} FCFA</p>
            <p className="text-graphite text-sm mb-5">{product.description || 'Aucune description disponible.'}</p>

            {product.sizes?.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-medium mb-2">Pointure</p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`w-10 h-10 rounded-full border text-sm ${size === s ? 'bg-ink text-paper border-ink' : 'border-line'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => addToCart(product, size)} className="btn-primary w-full">
              Ajouter au panier
            </button>
          </div>
        </div>

        <div className="border-t border-line mt-8 pt-6">
          <ReviewList productId={product.id} />
        </div>
      </div>
    </div>
  )
}

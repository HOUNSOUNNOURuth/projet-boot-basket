import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'chanceliere_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addToCart = (product, size, quantity = 1) => {
    setItems((prev) => {
      const key = `${product.id}-${size}`
      const existing = prev.find((i) => `${i.id}-${i.size}` === key)
      if (existing) {
        return prev.map((i) =>
          `${i.id}-${i.size}` === key ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          chariow_product_id: product.chariow_product_id || null,
          size,
          quantity,
        },
      ]
    })
    setIsOpen(true)
  }

  const removeFromCart = (id, size) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)))
  }

  const decreaseQuantity = (id, size) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id && i.size === size ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    )
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, decreaseQuantity, clearCart, total, count, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
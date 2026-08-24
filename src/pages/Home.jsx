import { useState } from 'react'
import Header from '../components/layout/Header'
import PromoBanner from '../components/layout/PromoBanner'
import BrandBar from '../components/brands/BrandBar'
import ProductGrid from '../components/products/ProductGrid'
import ShopCommentsSection from '../components/comments/ShopCommentsSection'
import Footer from '../components/layout/Footer'
import CartDrawer from '../components/cart/CartDrawer'
import { useProducts } from '../hooks/useProducts'

export default function Home() {
  const [search, setSearch] = useState('')
  const [brandId, setBrandId] = useState(null)
  const [categoryId, setCategoryId] = useState(null)
  const { products, loading } = useProducts({ brandId, categoryId, search })

  return (
    <div className="min-h-screen bg-paper">
      <Header search={search} onSearchChange={setSearch} />
      <PromoBanner />
      <BrandBar
        activeBrand={brandId}
        onBrandChange={setBrandId}
        activeCategory={categoryId}
        onCategoryChange={setCategoryId}
      />
      <ProductGrid products={products} loading={loading} />
      <ShopCommentsSection />
      <Footer />
      <CartDrawer />
    </div>
  )
}

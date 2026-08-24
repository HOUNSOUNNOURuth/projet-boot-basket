import ProductCard from './ProductCard'

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return <p className="max-w-7xl mx-auto px-6 mt-8 text-graphite">Chargement des articles...</p>
  }
  if (!products.length) {
    return <p className="max-w-7xl mx-auto px-6 mt-8 text-graphite">Aucun article trouvé.</p>
  }
  return (
    <div className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}

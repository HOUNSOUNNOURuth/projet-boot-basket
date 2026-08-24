import { useState } from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import ProductForm from '../../components/admin/ProductForm'
import { useProducts } from '../../hooks/useProducts'

export default function AdminProducts() {
  const { products, loading, refetch } = useProducts({})
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="font-display text-2xl font-semibold mb-6">Articles</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <ProductForm onSaved={refetch} />
          <div>
            <h3 className="font-display font-semibold mb-3">Articles publiés ({products.length})</h3>
            {loading ? <p className="text-graphite text-sm">Chargement...</p> : (
              <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
                {products.map((p) => (
                  <li key={p.id} className="card p-3 flex justify-between text-sm">
                    <span>{p.name}</span>
                    <span className="text-graphite">{p.price?.toLocaleString('fr-FR')} FCFA · stock {p.stock}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

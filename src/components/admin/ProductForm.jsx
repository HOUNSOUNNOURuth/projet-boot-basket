import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useBrands } from '../../hooks/useBrands'

export default function ProductForm({ onSaved }) {
  const { brands } = useBrands()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', sizes: '',
    brand_id: '', category_id: '', image_url: '', chariow_product_id: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => setCategories(data || []))
  }, [])

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const sizesArray = form.sizes
      ? form.sizes.split(',').map((s) => Number(s.trim())).filter(Boolean)
      : []
    const { error } = await supabase.from('products').insert({
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      sizes: sizesArray,
      brand_id: form.brand_id || null,
      category_id: form.category_id || null,
      image_url: form.image_url,
      chariow_product_id: form.chariow_product_id || null,
    })
    setSaving(false)
    if (!error) {
      setForm({ name: '', description: '', price: '', stock: '', sizes: '', brand_id: '', category_id: '', image_url: '', chariow_product_id: '' })
      onSaved?.()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-3 max-w-xl">
      <h3 className="font-display font-semibold mb-2">Publier un nouvel article</h3>
      <input required placeholder="Nom de l'article" value={form.name} onChange={update('name')} className="w-full border border-line rounded-lg px-3 py-2 text-sm" />
      <textarea placeholder="Description" value={form.description} onChange={update('description')} rows={3} className="w-full border border-line rounded-lg px-3 py-2 text-sm" />
      <div className="grid grid-cols-2 gap-3">
        <input required type="number" placeholder="Prix (FCFA)" value={form.price} onChange={update('price')} className="border border-line rounded-lg px-3 py-2 text-sm" />
        <input required type="number" placeholder="Stock" value={form.stock} onChange={update('stock')} className="border border-line rounded-lg px-3 py-2 text-sm" />
      </div>
      <input placeholder="Pointures (ex: 38,39,40)" value={form.sizes} onChange={update('sizes')} className="w-full border border-line rounded-lg px-3 py-2 text-sm" />
      <div className="grid grid-cols-2 gap-3">
        <select value={form.brand_id} onChange={update('brand_id')} className="border border-line rounded-lg px-3 py-2 text-sm">
          <option value="">Marque</option>
          {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select value={form.category_id} onChange={update('category_id')} className="border border-line rounded-lg px-3 py-2 text-sm">
          <option value="">Catégorie</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <input placeholder="URL de l'image" value={form.image_url} onChange={update('image_url')} className="w-full border border-line rounded-lg px-3 py-2 text-sm" />
      <input
        placeholder="ID produit Chariow (ex: prd_abc123) — optionnel"
        value={form.chariow_product_id}
        onChange={update('chariow_product_id')}
        className="w-full border border-line rounded-lg px-3 py-2 text-sm"
      />
      <p className="text-xs text-graphite -mt-2">
        Créez d'abord ce produit dans votre tableau de bord Chariow (même prix), puis collez son ID ici pour activer le paiement en ligne sur cet article.
      </p>
      <button disabled={saving} className="btn-primary w-full">{saving ? 'Publication...' : 'Publier l\'article'}</button>
    </form>
  )
}
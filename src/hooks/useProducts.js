import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useProducts({ brandId, categoryId, search } = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('products').select('*, brands(name, logo_url), categories(name)').order('created_at', { ascending: false })
    if (brandId) query = query.eq('brand_id', brandId)
    if (categoryId) query = query.eq('category_id', categoryId)
    if (search) query = query.ilike('name', `%${search}%`)
    const { data, error } = await query
    if (error) setError(error)
    setProducts(data || [])
    setLoading(false)
  }, [brandId, categoryId, search])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  return { products, loading, error, refetch: fetchProducts }
}

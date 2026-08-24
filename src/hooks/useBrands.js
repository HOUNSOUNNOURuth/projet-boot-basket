import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useBrands() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('brands').select('*').order('name').then(({ data }) => {
      setBrands(data || [])
      setLoading(false)
    })
  }, [])

  return { brands, loading }
}

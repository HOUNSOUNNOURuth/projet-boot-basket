import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useReviews(productId) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = useCallback(async () => {
    if (!productId) return
    setLoading(true)
    const { data } = await supabase
      .from('product_reviews')
      .select('*, profiles(full_name)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
    setReviews(data || [])
    setLoading(false)
  }, [productId])

  useEffect(() => { fetchReviews() }, [fetchReviews])

  const addReview = async ({ userId, rating, comment }) => {
    const { error } = await supabase.from('product_reviews').insert({
      product_id: productId,
      user_id: userId,
      rating,
      comment,
    })
    if (!error) fetchReviews()
    return { error }
  }

  const average = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return { reviews, loading, addReview, average }
}

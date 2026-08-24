import { useState } from 'react'
import { useReviews } from '../../hooks/useReviews'
import { useAuth } from '../../context/AuthContext'

export default function ReviewList({ productId }) {
  const { reviews, loading, addReview, average } = useReviews(productId)
  const { user } = useAuth()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    await addReview({ userId: user.id, rating, comment })
    setComment('')
    setSubmitting(false)
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h4 className="font-display font-semibold">Avis clients</h4>
        {average && <span className="text-sm text-graphite">★ {average} / 5 ({reviews.length})</span>}
      </div>

      {loading && <p className="text-sm text-graphite">Chargement des avis...</p>}
      {!loading && reviews.length === 0 && <p className="text-sm text-graphite">Aucun avis pour le moment.</p>}

      <ul className="space-y-3 max-h-56 overflow-y-auto mb-5">
        {reviews.map((r) => (
          <li key={r.id} className="border border-line rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{r.profiles?.full_name || 'Client'}</span>
              <span className="text-xs text-graphite">★ {r.rating}/5</span>
            </div>
            <p className="text-sm text-graphite">{r.comment}</p>
          </li>
        ))}
      </ul>

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border border-line rounded-lg px-3 py-2 text-sm">
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} étoiles</option>)}
          </select>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Votre avis sur ce produit..."
            className="w-full border border-line rounded-lg px-3 py-2 text-sm"
            rows={2}
            required
          />
          <button disabled={submitting} className="btn-primary text-sm">Publier mon avis</button>
        </form>
      ) : (
        <p className="text-sm text-graphite">Connectez-vous pour laisser un avis.</p>
      )}
    </div>
  )
}

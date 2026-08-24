import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

export default function ShopCommentsSection() {
  const { user, profile } = useAuth()
  const [comments, setComments] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchComments = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('shop_comments')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(20)
    setComments(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchComments() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !message.trim()) return
    await supabase.from('shop_comments').insert({ user_id: user.id, message })
    setMessage('')
    fetchComments()
  }

  return (
    <section className="max-w-7xl mx-auto px-6 mt-20">
      <h2 className="font-display text-2xl font-semibold mb-6">Ce que disent nos clients</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-3 mb-8 max-w-xl">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Laissez un commentaire sur la boutique..."
            className="flex-1 border border-line rounded-full px-4 py-2.5 text-sm"
          />
          <button className="btn-primary text-sm">Publier</button>
        </form>
      ) : (
        <p className="text-graphite text-sm mb-8">Connectez-vous pour laisser un commentaire.</p>
      )}

      {loading && <p className="text-graphite text-sm">Chargement...</p>}

      <div className="grid md:grid-cols-3 gap-4">
        {comments.map((c) => (
          <div key={c.id} className="card p-4">
            <p className="text-sm font-medium mb-1">{c.profiles?.full_name || 'Client'}</p>
            <p className="text-sm text-graphite">{c.message}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { translateAuthError } from '../../lib/errorMessages'

export default function LoginForm() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signIn({ email, password })
      navigate(params.get('redirect') || '/')
    } catch (err) {
      setError(translateAuthError(err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-line rounded-lg px-4 py-2.5 text-sm" />
      <input type="password" required placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)}
        className="w-full border border-line rounded-lg px-4 py-2.5 text-sm" />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button disabled={loading} className="btn-primary w-full">{loading ? 'Connexion...' : 'Se connecter'}</button>
    </form>
  )
}

import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { translateAuthError } from '../../lib/errorMessages'

export default function RegisterForm() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signUp(form)
      navigate(params.get('redirect') || '/')
    } catch (err) {
      setError(translateAuthError(err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <input required placeholder="Nom complet" value={form.fullName} onChange={update('fullName')}
        className="w-full border border-line rounded-lg px-4 py-2.5 text-sm" />
      <input required placeholder="Téléphone" value={form.phone} onChange={update('phone')}
        className="w-full border border-line rounded-lg px-4 py-2.5 text-sm" />
      <input type="email" required placeholder="Email" value={form.email} onChange={update('email')}
        className="w-full border border-line rounded-lg px-4 py-2.5 text-sm" />
      <input type="password" required placeholder="Mot de passe" value={form.password} onChange={update('password')}
        className="w-full border border-line rounded-lg px-4 py-2.5 text-sm" />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button disabled={loading} className="btn-primary w-full">{loading ? 'Création...' : 'Créer mon compte'}</button>
    </form>
  )
}

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LivreurRoute({ children }) {
  const { profile, loading, user } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/connexion" replace />
  if (profile?.role !== 'livreur' && profile?.role !== 'admin') return <Navigate to="/" replace />
  return children
}

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
  const { isAdmin, loading, user } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/connexion" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { profile, user } = useAuth()
  return (
    <div className="min-h-screen">
      <Header search="" onSearchChange={() => {}} />
      <div className="max-w-md mx-auto px-6 py-14">
        <h1 className="font-display text-2xl font-semibold mb-6">Mon profil</h1>
        <div className="card p-5 space-y-2 mb-6">
          <p><span className="text-graphite text-sm">Nom : </span>{profile?.full_name}</p>
          <p><span className="text-graphite text-sm">Téléphone : </span>{profile?.phone}</p>
          <p><span className="text-graphite text-sm">Email : </span>{user?.email}</p>
        </div>
        <Link to="/commandes" className="btn-outline inline-block">Voir mes commandes</Link>
      </div>
    </div>
  )
}

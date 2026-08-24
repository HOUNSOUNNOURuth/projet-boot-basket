import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import RegisterForm from '../components/auth/RegisterForm'

export default function Register() {
  return (
    <div className="min-h-screen">
      <Header search="" onSearchChange={() => {}} />
      <div className="max-w-md mx-auto px-6 py-16">
        <h1 className="font-display text-2xl font-semibold text-center mb-8">Créer un compte</h1>
        <RegisterForm />
        <p className="text-center text-sm text-graphite mt-6">
          Déjà un compte ? <Link to="/connexion" className="underline text-ink">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}

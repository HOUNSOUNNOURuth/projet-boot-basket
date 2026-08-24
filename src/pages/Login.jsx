import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import LoginForm from '../components/auth/LoginForm'

export default function Login() {
  return (
    <div className="min-h-screen">
      <Header search="" onSearchChange={() => {}} />
      <div className="max-w-md mx-auto px-6 py-16">
        <h1 className="font-display text-2xl font-semibold text-center mb-8">Se connecter</h1>
        <LoginForm />
        <p className="text-center text-sm text-graphite mt-6">
          Pas encore de compte ? <Link to="/inscription" className="underline text-ink">Créer un compte</Link>
        </p>
      </div>
    </div>
  )
}

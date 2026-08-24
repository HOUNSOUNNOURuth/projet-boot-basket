import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import HelpModal from '../help/HelpModal'
import NotificationBell from './NotificationBell'

export default function Header({ search, onSearchChange }) {
  const { user, profile, signOut } = useAuth()
  const { count, setIsOpen } = useCart()
  const [helpOpen, setHelpOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="border-b border-line bg-paper sticky top-0 z-40">
      {/* Ligne 1 : logo + nom */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center font-display font-bold">C</span>
          <span className="font-display text-xl font-semibold tracking-tight">Chancelière <span className="text-graphite">Shop</span></span>
        </Link>
      </div>

      {/* Ligne 2 : recherche / connexion / panier / aide - 6 éléments sur une ligne */}
      <div className="max-w-7xl mx-auto px-6 pb-4 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[220px] flex items-center border border-line rounded-full px-4 py-2 bg-mist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-graphite mr-2 shrink-0">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher une paire, une marque..."
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        {user ? (
          <button onClick={() => navigate('/profil')} className="btn-ghost text-sm border border-line">
            {profile?.full_name?.split(' ')[0] || 'Mon compte'}
          </button>
        ) : (
          <button onClick={() => navigate('/connexion')} className="btn-outline text-sm">
            Se connecter
          </button>
        )}

        <button onClick={() => setIsOpen(true)} className="btn-ghost relative border border-line text-sm flex items-center gap-2">
          Panier
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-ink text-paper text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {count}
            </span>
          )}
        </button>

        <button onClick={() => setHelpOpen(true)} className="btn-ghost border border-line text-sm">
          Aide
        </button>

        {user && (
          <button onClick={signOut} className="btn-ghost text-sm text-graphite">
            Déconnexion
          </button>
        )}

        {user && <NotificationBell />}

        {profile?.role === 'admin' && (
          <button onClick={() => navigate('/admin')} className="btn-primary text-sm">
            Espace boutique
          </button>
        )}

        {profile?.role === 'livreur' && (
          <button onClick={() => navigate('/livreur')} className="btn-primary text-sm">
            Espace livraison
          </button>
        )}
      </div>

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </header>
  )
}
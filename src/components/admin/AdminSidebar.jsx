import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const LINKS = [
  { to: '/admin', label: 'Tableau de bord', end: true },
  { to: '/admin/articles', label: 'Articles' },
  { to: '/admin/commandes', label: 'Commandes' },
  { to: '/admin/bilan', label: 'Bilan du jour' },
]

export default function AdminSidebar() {
  const { signOut } = useAuth()
  return (
    <aside className="w-56 shrink-0 border-r border-line min-h-screen p-5 bg-mist">
      <p className="font-display font-semibold mb-8">Chancelière <span className="text-graphite">Admin</span></p>
      <nav className="space-y-1">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-ink text-paper' : 'hover:bg-white text-graphite'}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <button onClick={signOut} className="text-sm text-graphite mt-8 hover:text-ink">Déconnexion</button>
    </aside>
  )
}

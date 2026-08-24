import { useState } from 'react'
import { useNotifications } from '../../hooks/useNotifications'

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 60) return "à l'instant"
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`
  return `il y a ${Math.floor(diff / 86400)} j`
}

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen((o) => !o); if (!open) markAllAsRead() }}
        className="relative btn-ghost border border-line text-sm w-10 h-10 flex items-center justify-center p-0"
        aria-label="Notifications"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M10 20a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-ink text-paper text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-paper border border-line rounded-2xl shadow-lg z-50">
            <div className="p-4 border-b border-line font-display font-semibold">Notifications</div>
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-graphite">Aucune notification pour le moment.</p>
            ) : (
              <ul>
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`p-4 border-b border-line/60 text-sm cursor-pointer ${!n.read ? 'bg-mist' : ''}`}
                  >
                    <p className="font-medium mb-0.5">{n.title}</p>
                    <p className="text-graphite">{n.message}</p>
                    <p className="text-xs text-graphite mt-1">{timeAgo(n.created_at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}

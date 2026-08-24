import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = useCallback(async () => {
    if (!user) { setNotifications([]); setLoading(false); return }
    setLoading(true)
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30)
    setNotifications(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchNotifications()
    if (!user) return

    // Mise à jour en direct dès qu'une nouvelle notification arrive
    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => setNotifications((prev) => [payload.new, ...prev])
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [user, fetchNotifications])

  const markAsRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    await supabase.from('notifications').update({ read: true }).eq('id', id)
  }

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read)
    if (!unread.length) return
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    await supabase.from('notifications').update({ read: true }).in('id', unread.map((n) => n.id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return { notifications, loading, unreadCount, markAsRead, markAllAsRead, refetch: fetchNotifications }
}

import { useState } from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import OrdersTable from '../../components/admin/OrdersTable'
import PaidOrdersTable from '../../components/admin/PaidOrdersTable'

export default function AdminOrders() {
  const [tab, setTab] = useState('en_cours')
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="font-display text-2xl font-semibold mb-6">Commandes</h1>
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('en_cours')} className={`px-4 py-2 rounded-full text-sm border ${tab === 'en_cours' ? 'bg-ink text-paper border-ink' : 'border-line'}`}>En cours</button>
          <button onClick={() => setTab('reglées')} className={`px-4 py-2 rounded-full text-sm border ${tab === 'reglées' ? 'bg-ink text-paper border-ink' : 'border-line'}`}>Réglées</button>
        </div>
        {tab === 'en_cours' ? <OrdersTable statuses={['en_attente_livraison', 'en_attente_paiement']} /> : <PaidOrdersTable />}
      </div>
    </div>
  )
}

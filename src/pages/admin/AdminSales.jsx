import AdminSidebar from '../../components/admin/AdminSidebar'
import DailySalesReport from '../../components/admin/DailySalesReport'
import UnsettledOrders from '../../components/admin/UnsettledOrders'

export default function AdminSales() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8 space-y-8">
        <h1 className="font-display text-2xl font-semibold mb-6">Bilan du jour</h1>
        <DailySalesReport />
        <UnsettledOrders />
      </div>
    </div>
  )
}
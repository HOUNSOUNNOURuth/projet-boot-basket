import OrdersTable from './OrdersTable'

export default function PaidOrdersTable() {
  return <OrdersTable statuses={['payée', 'livrée']} />
}

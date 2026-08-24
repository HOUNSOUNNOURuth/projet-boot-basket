import Header from '../components/layout/Header'
import DeliveryForm from '../components/checkout/DeliveryForm'

export default function Delivery() {
  return (
    <div className="min-h-screen">
      <Header search="" onSearchChange={() => {}} />
      <div className="max-w-2xl mx-auto px-6 py-14">
        <h1 className="font-display text-2xl font-semibold mb-8 text-center">Adresse de livraison</h1>
        <DeliveryForm />
      </div>
    </div>
  )
}

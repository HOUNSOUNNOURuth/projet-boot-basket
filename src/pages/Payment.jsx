import Header from '../components/layout/Header'
import PaymentForm from '../components/checkout/PaymentForm'

export default function Payment() {
  return (
    <div className="min-h-screen">
      <Header search="" onSearchChange={() => {}} />
      <div className="max-w-2xl mx-auto px-6 py-14">
        <h1 className="font-display text-2xl font-semibold mb-8 text-center">Paiement</h1>
        <PaymentForm />
      </div>
    </div>
  )
}

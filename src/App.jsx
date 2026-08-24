import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Delivery from './pages/Delivery'
import Payment from './pages/Payment'
import PaymentChariowReturn from './pages/PaymentChariowReturn'
import OrderConfirmation from './pages/OrderConfirmation'
import Profile from './pages/Profile'
import OrderHistory from './pages/OrderHistory'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminSales from './pages/admin/AdminSales'
import ProtectedRoute from './router/ProtectedRoute'
import AdminRoute from './router/AdminRoute'
import LivreurRoute from './router/LivreurRoute'
import LivreurDashboard from './pages/livreur/LivreurDashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/panier" element={<Cart />} />
      <Route path="/connexion" element={<Login />} />
      <Route path="/inscription" element={<Register />} />

      <Route path="/livraison" element={<ProtectedRoute><Delivery /></ProtectedRoute>} />
      <Route path="/paiement" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
      <Route path="/paiement-chariow-retour" element={<ProtectedRoute><PaymentChariowReturn /></ProtectedRoute>} />
      <Route path="/confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
      <Route path="/profil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/commandes" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />

      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/articles" element={<AdminRoute><AdminProducts /></AdminRoute>} />
      <Route path="/admin/commandes" element={<AdminRoute><AdminOrders /></AdminRoute>} />
      <Route path="/admin/bilan" element={<AdminRoute><AdminSales /></AdminRoute>} />

      <Route path="/livreur" element={<LivreurRoute><LivreurDashboard /></LivreurRoute>} />
    </Routes>
  )
}
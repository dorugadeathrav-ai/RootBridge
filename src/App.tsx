import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import RoleSelection from './pages/RoleSelection'
import BuyerHome from './pages/BuyerHome'
import BuyerRegister from './pages/BuyerRegister'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import VerifyOtp from './pages/VerifyOtp'
import ResetPassword from './pages/ResetPassword'
import SellerRegister from './pages/SellerRegister'
import SellerDashboardPage from './pages/seller/SellerDashboardPage'
import MyProductsPage from './pages/seller/MyProductsPage'
import AddProductPage from './pages/seller/AddProductPage'
import EditProductPage from './pages/seller/EditProductPage'
import SellerProfilePage from './pages/seller/SellerProfilePage'
import SellerDashboard from './pages/SellerDashboard'
import SellerAddProduct from './pages/SellerAddProduct'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelection />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/register/buyer" element={<BuyerRegister />} />
      <Route path="/seller/register" element={<SellerRegister />} />

      <Route element={<ProtectedRoute role="buyer" />}>
        <Route path="/buyer-dashboard" element={<BuyerHome />} />
      </Route>

      <Route element={<ProtectedRoute role="seller" />}>
        <Route path="/seller-dashboard" element={<SellerDashboardPage />} />
        <Route path="/seller-dashboard/products" element={<MyProductsPage />} />
        <Route path="/seller-dashboard/add-product" element={<AddProductPage />} />
        <Route path="/seller-dashboard/edit-product/:id" element={<EditProductPage />} />
        <Route path="/seller-dashboard/profile" element={<SellerProfilePage />} />

        <Route path="/seller/products/new" element={<Navigate to="/seller-dashboard/add-product" replace />} />
        <Route path="/seller/products/edit" element={<Navigate to="/seller-dashboard/products" replace />} />
        <Route path="/seller/products/edit/:id" element={<Navigate to="/seller-dashboard/edit-product/:id" replace />} />
      </Route>

      <Route path="/seller/dashboard" element={<Navigate to="/seller-dashboard" replace />} />
      <Route path="/seller-dashboard-old" element={<SellerDashboard />} />
      <Route path="/seller/products/add" element={<SellerAddProduct />} />

      <Route path="/buyer" element={<BuyerHome />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

// Auth Pages
import RoleSelection from './pages/RoleSelection'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import VerifyOtp from './pages/VerifyOtp'
import ResetPassword from './pages/ResetPassword'
import BuyerRegister from './pages/BuyerRegister'
import SellerRegister from './pages/SellerRegister'

// Layouts
import CustomerLayout from './components/layout/CustomerLayout'
import ProtectedRoute from './components/ProtectedRoute'

// Customer Pages
import HomePage from './pages/customer/HomePage'
import ProductList from './pages/customer/ProductList'
import ProductDetails from './pages/customer/ProductDetails'
import CartPage from './pages/customer/CartPage'
import CheckoutPage from './pages/customer/CheckoutPage'
import OrdersPage from './pages/customer/OrdersPage'

// Seller Pages
import SellerDashboardPage from './pages/seller/SellerDashboardPage'
import MyProductsPage from './pages/seller/MyProductsPage'
import AddProductPage from './pages/seller/AddProductPage'
import EditProductPage from './pages/seller/EditProductPage'
import SellerProfilePage from './pages/seller/SellerProfilePage'
import SellerOrdersPage from './pages/seller/SellerOrdersPage'

import AdminLayout from './components/layout/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminVendors from './pages/admin/AdminVendors'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'

export default function App() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        
        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute role="customer" />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/buyer-dashboard" element={<Navigate to="/" replace />} />
        </Route>
      </Route>

      {/* Auth Routes */}
      <Route path="/role" element={<RoleSelection />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/register/buyer" element={<BuyerRegister />} />
      <Route path="/seller/register" element={<SellerRegister />} />

      {/* Vendor Routes */}
      <Route element={<ProtectedRoute role="vendor" />}>
        <Route path="/seller-dashboard" element={<SellerDashboardPage />} />
        <Route path="/seller-dashboard/products" element={<MyProductsPage />} />
        <Route path="/seller-dashboard/add-product" element={<AddProductPage />} />
        <Route path="/seller-dashboard/edit-product/:id" element={<EditProductPage />} />
        <Route path="/seller-dashboard/orders" element={<SellerOrdersPage />} />
        <Route path="/seller-dashboard/profile" element={<SellerProfilePage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/vendors" element={<AdminVendors />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

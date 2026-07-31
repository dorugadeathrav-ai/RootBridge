import React from 'react'
import { Routes, Route } from 'react-router-dom'
import RoleSelection from './pages/RoleSelection'
import BuyerHome from './pages/BuyerHome'
import SellerRegister from './pages/SellerRegister'
import SellerDashboard from './pages/SellerDashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelection />} />
      <Route path="/buyer" element={<BuyerHome />} />
      <Route path="/seller/register" element={<SellerRegister />} />
      <Route path="/seller/dashboard" element={<SellerDashboard />} />
    </Routes>
  )
}

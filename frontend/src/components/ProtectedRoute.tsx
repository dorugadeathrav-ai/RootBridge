import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { UserRole } from '../utils/auth'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ role }: { role: UserRole | 'admin' }) {
  const { currentUser } = useAuth()
  if (!currentUser) return <Navigate to="/login" replace />
  if (currentUser.role !== role) {
    if (currentUser.role === 'admin') return <Navigate to="/admin/dashboard" replace />
    if (currentUser.role === 'vendor') return <Navigate to="/seller-dashboard" replace />
    return <Navigate to="/" replace />
  }
  return <Outlet />
}

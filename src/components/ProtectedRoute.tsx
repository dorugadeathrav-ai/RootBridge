import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { UserRole } from '../utils/auth'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ role }: { role: UserRole }) {
  const { currentUser } = useAuth()
  if (!currentUser) return <Navigate to="/login" replace />
  if (currentUser.role !== role) return <Navigate to={currentUser.role === 'buyer' ? '/buyer-dashboard' : '/seller-dashboard'} replace />
  return <Outlet />
}

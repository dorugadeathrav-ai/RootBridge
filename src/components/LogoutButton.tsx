import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LogoutButton() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  return <button onClick={() => { logout(); navigate('/login', { replace: true }) }} className="text-red-600 hover:text-red-800">Logout</button>
}

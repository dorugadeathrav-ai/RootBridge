import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { resetPassword } from '../services/authService'
import { RESET_EMAIL_KEY } from './ForgotPassword'

export default function ResetPassword() {
  const email = sessionStorage.getItem(RESET_EMAIL_KEY) ?? ''
  const isVerified = sessionStorage.getItem('rootbridge_otp_verified') === 'true'
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!email || !isVerified) return navigate('/forgot-password', { replace: true })
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    if (!confirmPassword || password !== confirmPassword) return setError('Passwords do not match.')
    const result = await resetPassword(email, password)
    if (!result) return setError('Unable to reset password. Please try again.')
    setError('')
    setSuccess('Password changed successfully.')
    sessionStorage.removeItem(RESET_EMAIL_KEY)
    sessionStorage.removeItem('rootbridge_otp_verified')
    window.setTimeout(() => navigate('/login', { replace: true }), 900)
  }

  return <div className="min-h-screen bg-gray-50 px-6 py-10"><div className="mx-auto max-w-md"><Link to="/" className="text-2xl font-semibold text-emerald-600">RootBridge</Link><form onSubmit={submit} className="mt-8 rounded bg-white p-6 shadow-sm sm:p-8"><h1 className="text-3xl font-semibold">Create New Password</h1><div className="mt-6 space-y-4"><div><label className="text-sm">New Password</label><div className="mt-1 flex rounded border"><input required type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 outline-none" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="px-3 text-sm text-emerald-600">{showPassword ? 'Hide' : 'Show'}</button></div></div><div><label className="text-sm">Confirm New Password</label><div className="mt-1 flex rounded border"><input required type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-2 outline-none" /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="px-3 text-sm text-emerald-600">{showConfirmPassword ? 'Hide' : 'Show'}</button></div></div>{error && <p className="text-sm text-red-600" role="alert">{error}</p>}{success && <p className="text-sm text-emerald-700" role="status">{success}</p>}<button className="w-full rounded bg-emerald-600 px-4 py-2 font-semibold text-white">Change Password</button></div></form></div></div>
}

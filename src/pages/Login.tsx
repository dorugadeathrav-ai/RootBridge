import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { currentUser, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const registrationMessage = (location.state as { message?: string } | null)?.message

  useEffect(() => {
    if (currentUser) navigate(currentUser.role === 'buyer' ? '/buyer-dashboard' : '/seller-dashboard', { replace: true })
  }, [currentUser, navigate])

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!email.trim() || !password) {
      setError('Email and password are required.')
      return
    }
    setError('')
    setIsLoading(true)
    window.setTimeout(() => {
      const result = login(email, password, remember)
      setIsLoading(false)
      if (result === 'not-found') return setError('No account exists with this email.')
      if (result === 'invalid') return setError('Incorrect password.')
      const from = (location.state as { from?: string } | null)?.from
      navigate(from ?? (result.role === 'buyer' ? '/buyer-dashboard' : '/seller-dashboard'), { replace: true })
    }, 300)
  }

  return <div className="min-h-screen bg-gray-50 px-6 py-10"><div className="mx-auto max-w-md">
    <Link to="/" className="text-2xl font-semibold text-emerald-600">RootBridge</Link>
    <div className="mt-8 rounded bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-3xl font-semibold">Welcome Back</h1><p className="mt-2 text-slate-600">Sign in to continue to RootBridge.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        {registrationMessage && <p className="text-sm text-emerald-700" role="status">{registrationMessage}</p>}
        <div><label className="text-sm">Email Address</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full rounded border p-2" required /></div>
        <div><div className="flex items-center justify-between"><label className="text-sm">Password</label><button type="button" onClick={() => setShowPassword(!showPassword)} className="text-sm text-emerald-600">{showPassword ? 'Hide' : 'Show'}</button></div><input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full rounded border p-2" required /></div>
        <div className="flex items-center justify-between text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> Remember Me</label><Link to="/forgot-password" className="text-emerald-600">Forgot Password?</Link></div>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        <button disabled={isLoading} className="w-full rounded bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70">{isLoading ? 'Logging in...' : 'Login'}</button>
      </form>
      <div className="mt-6 border-t pt-5 text-center text-sm text-slate-600"><p>Don't have an account?</p><div className="mt-3 flex gap-2"><Link to="/register/buyer" className="flex-1 rounded border border-emerald-600 px-3 py-2 text-emerald-700">Register as Buyer</Link><Link to="/seller/register" className="flex-1 rounded border border-emerald-600 px-3 py-2 text-emerald-700">Register as Seller</Link></div></div>
    </div>
  </div></div>
}

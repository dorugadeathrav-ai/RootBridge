import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function BuyerRegister() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    if (!form.confirmPassword || form.password !== form.confirmPassword) return setError('Passwords do not match.')
    const { confirmPassword: _confirmPassword, ...account } = form
    if (!register({ ...account, id: `buyer-${Date.now()}`, role: 'buyer' })) return setError('An account with this email already exists.')
    navigate('/login')
  }
  return <div className="min-h-screen bg-gray-50 px-6 py-10"><div className="mx-auto max-w-md"><Link to="/" className="text-2xl font-semibold text-emerald-600">RootBridge</Link><form onSubmit={submit} className="mt-8 rounded bg-white p-6 shadow-sm sm:p-8"><h1 className="text-3xl font-semibold">Register as Buyer</h1><div className="mt-6 space-y-4"><div><label className="text-sm">Full Name</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded border p-2" /></div><div><label className="text-sm">Email Address</label><input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded border p-2" /></div><div><label className="text-sm">Password</label><div className="mt-1 flex rounded border"><input required type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full p-2 outline-none" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="px-3 text-sm text-emerald-600">{showPassword ? 'Hide' : 'Show'}</button></div></div><div><label className="text-sm">Confirm Password</label><div className="mt-1 flex rounded border"><input required type={showConfirmPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={e => { const confirmPassword = e.target.value; setForm({ ...form, confirmPassword }); setError(confirmPassword && form.password !== confirmPassword ? 'Passwords do not match.' : '') }} className="w-full p-2 outline-none" /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="px-3 text-sm text-emerald-600">{showConfirmPassword ? 'Hide' : 'Show'}</button></div></div>{error && <p className="text-sm text-red-600">{error}</p>}<button className="w-full rounded bg-emerald-600 px-4 py-2 font-semibold text-white">Create Buyer Account</button><p className="text-center text-sm text-slate-600">Already registered? <Link to="/login" className="text-emerald-600">Login</Link></p></div></form></div></div>
}

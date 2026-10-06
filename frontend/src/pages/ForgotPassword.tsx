import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { sendPasswordResetOtp } from '../services/authService'

const RESET_EMAIL_KEY = 'rootbridge_reset_email'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await sendPasswordResetOtp(email)
      if (!result.ok) return setError(result.error ?? 'Unable to send OTP.')
      sessionStorage.setItem(RESET_EMAIL_KEY, email.trim())
      navigate('/verify-otp', { state: { email: email.trim(), demoOtp: result.demoOtp } })
    } catch {
      setError('Unable to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return <div className="min-h-screen bg-gray-50 px-6 py-10"><div className="mx-auto max-w-md"><Link to="/" className="text-2xl font-semibold text-emerald-600">RootBridge</Link><form onSubmit={submit} className="mt-8 rounded bg-white p-6 shadow-sm sm:p-8"><h1 className="text-3xl font-semibold">Forgot Password?</h1><p className="mt-2 text-slate-600">Enter your registered email address. We will send an OTP to verify your account.</p><div className="mt-6"><label className="text-sm">Email Address</label><input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full rounded border p-2" />{error && <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>}</div><button disabled={loading} className="mt-5 w-full rounded bg-emerald-600 px-4 py-2 font-semibold text-white disabled:opacity-70">{loading ? 'Sending OTP...' : 'Send OTP'}</button><p className="mt-4 text-center text-sm"><Link to="/login" className="text-emerald-600">Back to Login</Link></p></form></div></div>
}

export { RESET_EMAIL_KEY }

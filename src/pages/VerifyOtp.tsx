import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { isDemoOtpMode, sendPasswordResetOtp, verifyPasswordResetOtp } from '../services/authService'
import { clearOtp } from '../utils/otp'
import { RESET_EMAIL_KEY } from './ForgotPassword'

export default function VerifyOtp() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = (location.state as { email?: string } | null)?.email ?? sessionStorage.getItem(RESET_EMAIL_KEY) ?? ''
  const [otp, setOtp] = useState('')
  const [seconds, setSeconds] = useState(105)
  const [error, setError] = useState('')
  const [demoOtp, setDemoOtp] = useState((location.state as { demoOtp?: string } | null)?.demoOtp ?? '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!email) navigate('/forgot-password', { replace: true })
  }, [email, navigate])

  useEffect(() => {
    if (seconds === 0) return
    const timer = window.setInterval(() => setSeconds(value => value - 1), 1000)
    return () => window.clearInterval(timer)
  }, [seconds])

  async function verify(event: React.FormEvent) {
    event.preventDefault()
    if (!/^\d{6}$/.test(otp)) return setError('Enter the 6-digit OTP.')
    setLoading(true)
    const valid = await verifyPasswordResetOtp(email, otp)
    setLoading(false)
    if (!valid) return setError('Invalid or expired OTP.')
    clearOtp()
    sessionStorage.setItem('rootbridge_otp_verified', 'true')
    navigate('/reset-password')
  }

  async function resend() {
    if (seconds > 0) return
    const result = await sendPasswordResetOtp(email)
    if (result.ok) {
      setSeconds(105)
      setOtp('')
      setError('')
      setDemoOtp(result.demoOtp ?? '')
    }
  }

  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')
  const remaining = String(seconds % 60).padStart(2, '0')
  return <div className="min-h-screen bg-gray-50 px-6 py-10"><div className="mx-auto max-w-md"><Link to="/" className="text-2xl font-semibold text-emerald-600">RootBridge</Link><form onSubmit={verify} className="mt-8 rounded bg-white p-6 shadow-sm sm:p-8"><h1 className="text-3xl font-semibold">Verify Your Email</h1><p className="mt-2 text-slate-600">We have sent a 6-digit OTP to:</p><p className="font-medium text-emerald-800">{email}</p><div className="mt-6"><label className="text-sm">OTP</label><input autoFocus required inputMode="numeric" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="mt-1 w-full rounded border p-3 text-center text-xl tracking-[0.5em]" />{error && <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>}</div>{isDemoOtpMode() && demoOtp && <p className="mt-4 rounded bg-amber-50 p-3 text-sm text-amber-900">Demo OTP: <strong>{demoOtp}</strong></p>}<button disabled={loading} className="mt-5 w-full rounded bg-emerald-600 px-4 py-2 font-semibold text-white disabled:opacity-70">{loading ? 'Verifying...' : 'Verify OTP'}</button><div className="mt-4 text-center text-sm text-slate-600">{seconds > 0 ? `Resend OTP in ${minutes}:${remaining}` : <button type="button" onClick={resend} className="text-emerald-600">Resend OTP</button>}</div></form></div></div>
}

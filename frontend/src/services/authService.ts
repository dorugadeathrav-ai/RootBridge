import { generateOtp, getOtp, saveOtp } from '../utils/otp'

const demoOtpMode = import.meta.env.VITE_DEMO_OTP_MODE !== 'false'

export async function sendPasswordResetOtp(email: string) {
  // Always mock success since we don't have a real backend users endpoint for public querying
  if (!demoOtpMode) {
    const response = await fetch('/api/auth/send-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    if (!response.ok) throw new Error('Unable to send OTP.')
    return { ok: true, demoOtp: undefined }
  }
  const otp = generateOtp()
  saveOtp({ email: email.trim(), otp, expiresAt: Date.now() + 5 * 60 * 1000, attempts: 0 })
  console.info(`[RootBridge demo OTP] ${email}: ${otp}`)
  return { ok: true, demoOtp: otp }
}

export async function verifyPasswordResetOtp(email: string, otp: string) {
  if (!demoOtpMode) {
    const response = await fetch('/api/auth/verify-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, otp }) })
    return response.ok
  }
  const record = getOtp()
  if (!record || record.email.toLowerCase() !== email.toLowerCase() || Date.now() > record.expiresAt || record.attempts >= 5) return false
  if (record.otp !== otp) {
    saveOtp({ ...record, attempts: record.attempts + 1 })
    return false
  }
  return true
}

export function isDemoOtpMode() {
  return demoOtpMode
}

export async function resetPassword(email: string, newPassword: string) {
  if (!demoOtpMode) {
    const response = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, newPassword }) })
    return response.ok
  }
  return true; // Mock success
}
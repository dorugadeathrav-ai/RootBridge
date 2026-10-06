export type OtpRecord = {
  email: string
  otp: string
  expiresAt: number
  attempts: number
}

const OTP_KEY = 'rootbridge_otp'

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function saveOtp(record: OtpRecord) {
  sessionStorage.setItem(OTP_KEY, JSON.stringify(record))
}

export function getOtp(): OtpRecord | null {
  const raw = sessionStorage.getItem(OTP_KEY)
  return raw ? JSON.parse(raw) as OtpRecord : null
}

export function clearOtp() {
  sessionStorage.removeItem(OTP_KEY)
}
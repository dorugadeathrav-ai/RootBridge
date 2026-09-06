import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { indiaLocations } from '../data/indiaLocations'
import { useAuth } from '../context/AuthContext'

type FormState = { fullName: string; email: string; phone: string; password: string; confirmPassword: string; businessName: string; businessDescription: string; state: string; district: string; taluka: string; city: string; pin: string }
const initial: FormState = { fullName: '', email: '', phone: '', password: '', confirmPassword: '', businessName: '', businessDescription: '', state: '', district: '', taluka: '', city: '', pin: '' }

export default function SellerRegister() {
  const [form, setForm] = useState<FormState>(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  const districts = form.state ? Object.keys(indiaLocations[form.state] ?? {}) : []
  const talukas = form.state && form.district ? Object.keys(indiaLocations[form.state]?.[form.district] ?? {}) : []
  const cities = form.state && form.district && form.taluka ? indiaLocations[form.state]?.[form.district]?.[form.taluka] ?? [] : []
  const update = (field: keyof FormState, value: string) => setForm(previous => ({ ...previous, [field]: value }))

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!form.fullName) nextErrors.fullName = 'Full Name is required'
    if (!form.email) nextErrors.email = 'Email is required'
    if (!form.phone) nextErrors.phone = 'Mobile Number is required'
    if (form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters'
    if (!form.confirmPassword || form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.'
    if (!form.state) nextErrors.state = 'State is required'
    if (!form.district) nextErrors.district = 'District is required'
    if (!form.taluka) nextErrors.taluka = 'Taluka is required'
    if (!form.city) nextErrors.city = 'Village / City is required'
    if (!/^\d{6}$/.test(form.pin)) nextErrors.pin = 'Enter a valid 6-digit PIN Code'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    const id = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `seller-${Date.now()}`
    const account = { id, name: form.fullName, email: form.email, password: form.password, role: 'seller' as const, createdAt: new Date().toISOString(), profile: { phone: form.phone, businessName: form.businessName, businessDescription: form.businessDescription, location: { state: form.state, district: form.district, taluka: form.taluka, villageCity: form.city, pinCode: form.pin } } }
    if (!register(account)) return setErrors({ email: 'An account with this email already exists.' })
    navigate('/login', { state: { message: 'Seller account created successfully. Please log in.' } })
  }

  return <div className="min-h-screen bg-gray-50 p-6"><div className="mx-auto max-w-4xl"><h1 className="text-3xl font-semibold">Start Selling with RootBridge</h1><p className="text-slate-600">Take your local business to a wider market.</p><form onSubmit={submit} className="mt-6 rounded bg-white p-6 shadow-sm"><h3 className="mb-2 font-semibold">Personal Information</h3><div className="grid grid-cols-1 gap-3 md:grid-cols-3"><Field label="Full Name *" value={form.fullName} onChange={value => update('fullName', value)} error={errors.fullName} /><Field label="Email Address *" type="email" value={form.email} onChange={value => update('email', value)} error={errors.email} /><Field label="Mobile Number *" value={form.phone} onChange={value => update('phone', value)} error={errors.phone} /><PasswordField label="Password *" value={form.password} show={showPassword} onChange={value => update('password', value)} toggle={() => setShowPassword(!showPassword)} error={errors.password} /><PasswordField label="Confirm Password *" value={form.confirmPassword} show={showConfirmPassword} onChange={value => { update('confirmPassword', value); setErrors(previous => ({ ...previous, confirmPassword: value && form.password !== value ? 'Passwords do not match.' : '' })) }} toggle={() => setShowConfirmPassword(!showConfirmPassword)} error={errors.confirmPassword} /></div><h3 className="mb-2 mt-6 font-semibold">Business Information</h3><div className="grid grid-cols-1 gap-3 md:grid-cols-2"><Field label="Business / Farm / Shop Name" value={form.businessName} onChange={value => update('businessName', value)} /><div><label className="text-sm">Business Description</label><textarea value={form.businessDescription} onChange={event => update('businessDescription', event.target.value)} className="w-full rounded border p-2" /></div></div><h3 className="mb-2 mt-6 font-semibold">Location</h3><div className="grid grid-cols-1 gap-3 md:grid-cols-3"><SelectField label="State *" value={form.state} options={Object.keys(indiaLocations)} placeholder="Select State" onChange={state => setForm({ ...form, state, district: '', taluka: '', city: '' })} error={errors.state} /><SelectField label="District *" value={form.district} options={districts} placeholder={form.state ? 'Select District' : 'Select State First'} disabled={!form.state} onChange={district => setForm({ ...form, district, taluka: '', city: '' })} error={errors.district} /><SelectField label="Taluka *" value={form.taluka} options={talukas} placeholder={form.district ? 'Select Taluka' : 'Select District First'} disabled={!form.district} onChange={taluka => setForm({ ...form, taluka, city: '' })} error={errors.taluka} /><SelectField label="Village / City *" value={form.city} options={cities as string[]} placeholder={form.taluka ? 'Select Village / City' : 'Select Taluka First'} disabled={!form.taluka} onChange={city => update('city', city)} error={errors.city} /><Field label="PIN Code *" type="number" value={form.pin} onChange={value => update('pin', value.replace(/\D/g, '').slice(0, 6))} error={errors.pin} /></div><div className="mt-6 flex items-center gap-4"><button className="rounded bg-emerald-600 px-4 py-2 text-white">Create Seller Profile</button><div className="text-sm">Already have a seller account? <Link to="/login" className="text-emerald-600">Sign in</Link></div></div></form></div></div>
}

function Field({ label, value, onChange, error, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; error?: string; type?: string }) { return <div><label className="text-sm">{label}</label><input type={type} value={value} onChange={event => onChange(event.target.value)} className="w-full rounded border p-2" />{error && <div className="text-sm text-red-600">{error}</div>}</div> }
function PasswordField({ label, value, show, onChange, toggle, error }: { label: string; value: string; show: boolean; onChange: (value: string) => void; toggle: () => void; error?: string }) { return <div><label className="text-sm">{label}</label><div className="flex rounded border"><input type={show ? 'text' : 'password'} value={value} onChange={event => onChange(event.target.value)} className="w-full p-2 outline-none" /><button type="button" onClick={toggle} className="px-3 text-sm text-emerald-600">{show ? 'Hide' : 'Show'}</button></div>{error && <div className="text-sm text-red-600">{error}</div>}</div> }
function SelectField({ label, value, options, placeholder, disabled, onChange, error }: { label: string; value: string; options: string[]; placeholder: string; disabled?: boolean; onChange: (value: string) => void; error?: string }) { return <div><label className="text-sm">{label}</label><select value={value} onChange={event => onChange(event.target.value)} disabled={disabled} className="w-full rounded border p-2 disabled:bg-gray-100" required><option value="">{placeholder}</option>{options.map(option => <option key={option} value={option}>{option}</option>)}</select>{error && <div className="text-sm text-red-600">{error}</div>}</div> }

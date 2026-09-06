import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import Sidebar from '../../components/dashboard/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { getRegisteredUser, updateRegisteredUser } from '../../utils/auth'
import { indiaLocations } from '../../data/indiaLocations'

type SellerProfileForm = {
  fullName: string
  email: string
  mobile: string
  businessName: string
  state: string
  district: string
  taluka: string
  villageCity: string
  pinCode: string
}

export default function SellerProfilePage() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const seller = currentUser ? getRegisteredUser(currentUser.id) : null
  const profile = (seller?.profile as { phone?: string; businessName?: string; location?: { state?: string; district?: string; taluka?: string; villageCity?: string; pinCode?: string } } | undefined) ?? {}

  const [form, setForm] = useState<SellerProfileForm>({
    fullName: seller?.name ?? currentUser?.name ?? '',
    email: seller?.email ?? currentUser?.email ?? '',
    mobile: profile.phone ?? '',
    businessName: profile.businessName ?? '',
    state: profile.location?.state ?? '',
    district: profile.location?.district ?? '',
    taluka: profile.location?.taluka ?? '',
    villageCity: profile.location?.villageCity ?? '',
    pinCode: profile.location?.pinCode ?? ''
  })

  const stateOptions = Object.keys(indiaLocations)
  const districtOptions = form.state ? Object.keys(indiaLocations[form.state as keyof typeof indiaLocations] ?? {}) : []
  const talukaOptions = form.state && form.district ? Object.keys((indiaLocations[form.state as keyof typeof indiaLocations] as Record<string, Record<string, string[]>>)[form.district] ?? {}) : []
  const cityOptions = form.state && form.district && form.taluka ? ((indiaLocations[form.state as keyof typeof indiaLocations] as Record<string, Record<string, string[]>>)[form.district] ?? {})[form.taluka] ?? [] : []

  const updateField = (field: keyof SellerProfileForm, value: string) => {
    setForm(previous => ({ ...previous, [field]: value }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!seller || !currentUser) return

    const nextSeller = {
      ...seller,
      name: form.fullName,
      email: form.email,
      profile: {
        ...seller.profile,
        phone: form.mobile,
        businessName: form.businessName,
        location: {
          state: form.state,
          district: form.district,
          taluka: form.taluka,
          villageCity: form.villageCity,
          pinCode: form.pinCode
        }
      }
    }

    updateRegisteredUser(nextSeller)
    navigate('/seller-dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        <Sidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen(value => !value)}
          onLogout={() => {
            logout()
            navigate('/login', { replace: true })
          }}
        />

        <div className="flex min-h-screen flex-1 flex-col">
          <DashboardHeader title="My Profile" onMenuToggle={() => setSidebarOpen(value => !value)} />

          <main className="flex-1 p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Account Details</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">Seller profile</h2>
                </div>
                <button type="button" onClick={() => navigate('/seller-dashboard')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Back to Dashboard</button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
                  <input value={form.fullName} onChange={event => updateField('fullName', event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-emerald-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                  <input type="email" value={form.email} onChange={event => updateField('email', event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-emerald-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Mobile Number</label>
                  <input value={form.mobile} onChange={event => updateField('mobile', event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-emerald-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Business Name</label>
                  <input value={form.businessName} onChange={event => updateField('businessName', event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-emerald-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">State</label>
                  <select value={form.state} onChange={event => { updateField('state', event.target.value); updateField('district', ''); updateField('taluka', ''); updateField('villageCity', ''); }} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-emerald-500">
                    <option value="">Select State</option>
                    {stateOptions.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">District</label>
                  <select value={form.district} disabled={!form.state} onChange={event => { updateField('district', event.target.value); updateField('taluka', ''); updateField('villageCity', ''); }} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-emerald-500 disabled:bg-slate-100">
                    <option value="">Select District</option>
                    {districtOptions.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Taluka</label>
                  <select value={form.taluka} disabled={!form.district} onChange={event => { updateField('taluka', event.target.value); updateField('villageCity', ''); }} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-emerald-500 disabled:bg-slate-100">
                    <option value="">Select Taluka</option>
                    {talukaOptions.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Village / City</label>
                  <select value={form.villageCity} disabled={!form.taluka} onChange={event => updateField('villageCity', event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-emerald-500 disabled:bg-slate-100">
                    <option value="">Select Village / City</option>
                    {cityOptions.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">PIN Code</label>
                  <input value={form.pinCode} onChange={event => updateField('pinCode', event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-emerald-500" />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => navigate('/seller-dashboard')} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Update Profile</button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  )
}

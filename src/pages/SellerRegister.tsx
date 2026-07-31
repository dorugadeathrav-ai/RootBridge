import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

type FormState = {
  fullName: string
  email: string
  phone: string
  businessName: string
  businessType: string
  businessDescription: string
  city: string
  district: string
  state: string
  pin: string
  primaryCategory: string
  productDescription: string
  sellsOnline: string
}

const initial: FormState = {
  fullName: '',
  email: '',
  phone: '',
  businessName: '',
  businessType: '',
  businessDescription: '',
  city: '',
  district: '',
  state: '',
  pin: '',
  primaryCategory: '',
  productDescription: '',
  sellsOnline: 'No'
}

export default function SellerRegister() {
  const [form, setForm] = useState<FormState>(initial)
  const [errors, setErrors] = useState<Record<string,string>>({})
  const nav = useNavigate()

  function update(k: keyof FormState, v: string) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  function validate() {
    const e: Record<string,string> = {}
    if (!form.fullName) e.fullName = 'Full Name is required'
    if (!form.email) e.email = 'Email is required'
    if (!form.phone) e.phone = 'Phone number is required'
    if (!form.businessName) e.businessName = 'Business / Brand Name is required'
    if (!form.city) e.city = 'City is required'
    if (!form.pin) e.pin = 'PIN Code is required'
    if (!form.primaryCategory) e.primaryCategory = 'Primary product category is required'
    return e
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length === 0) {
      // store to localStorage as demo
      const seller = { id: 'seller-' + Date.now(), fullName: form.fullName, email: form.email }
      localStorage.setItem('rb_seller', JSON.stringify({ ...form, id: seller.id }))
      nav('/seller/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold">Start Selling with RootBridge</h1>
        <p className="text-slate-600">Take your local business to a wider market.</p>

        <form onSubmit={onSubmit} className="mt-6 bg-white p-6 rounded shadow-sm">
          <h3 className="font-semibold mb-2">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm">Full Name *</label>
              <input value={form.fullName} onChange={e => update('fullName', e.target.value)} className="w-full p-2 border rounded" />
              {errors.fullName && <div className="text-red-600 text-sm">{errors.fullName}</div>}
            </div>
            <div>
              <label className="text-sm">Email Address *</label>
              <input value={form.email} onChange={e => update('email', e.target.value)} className="w-full p-2 border rounded" />
              {errors.email && <div className="text-red-600 text-sm">{errors.email}</div>}
            </div>
            <div>
              <label className="text-sm">Phone Number *</label>
              <input value={form.phone} onChange={e => update('phone', e.target.value)} className="w-full p-2 border rounded" />
              {errors.phone && <div className="text-red-600 text-sm">{errors.phone}</div>}
            </div>
          </div>

          <h3 className="font-semibold mt-6 mb-2">Business Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Business / Brand Name *</label>
              <input value={form.businessName} onChange={e => update('businessName', e.target.value)} className="w-full p-2 border rounded" />
              {errors.businessName && <div className="text-red-600 text-sm">{errors.businessName}</div>}
            </div>
            <div>
              <label className="text-sm">Business Type</label>
              <select value={form.businessType} onChange={e => update('businessType', e.target.value)} className="w-full p-2 border rounded">
                <option value="">Select type</option>
                <option>Farmer</option>
                <option>Artisan</option>
                <option>Self Help Group</option>
                <option>Small Scale Industry</option>
                <option>Local Brand</option>
                <option>Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm">Business Description</label>
              <textarea value={form.businessDescription} onChange={e => update('businessDescription', e.target.value)} className="w-full p-2 border rounded" />
            </div>
          </div>

          <h3 className="font-semibold mt-6 mb-2">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm">Village / City *</label>
              <input value={form.city} onChange={e => update('city', e.target.value)} className="w-full p-2 border rounded" />
              {errors.city && <div className="text-red-600 text-sm">{errors.city}</div>}
            </div>
            <div>
              <label className="text-sm">District</label>
              <input value={form.district} onChange={e => update('district', e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="text-sm">State</label>
              <input value={form.state} onChange={e => update('state', e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="text-sm">PIN Code *</label>
              <input value={form.pin} onChange={e => update('pin', e.target.value)} className="w-full p-2 border rounded" />
              {errors.pin && <div className="text-red-600 text-sm">{errors.pin}</div>}
            </div>
          </div>

          <h3 className="font-semibold mt-6 mb-2">Product Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Primary Product Category *</label>
              <select value={form.primaryCategory} onChange={e => update('primaryCategory', e.target.value)} className="w-full p-2 border rounded">
                <option value="">Select</option>
                <option>Agriculture</option>
                <option>Organic Products</option>
                <option>Food Products</option>
                <option>Handicrafts</option>
                <option>Handloom</option>
                <option>Dairy</option>
                <option>Spices</option>
                <option>Other</option>
              </select>
              {errors.primaryCategory && <div className="text-red-600 text-sm">{errors.primaryCategory}</div>}
            </div>
            <div>
              <label className="text-sm">Product Description</label>
              <input value={form.productDescription} onChange={e => update('productDescription', e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm">Do you currently sell online?</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2"><input type="radio" name="online" checked={form.sellsOnline === 'Yes'} onChange={() => update('sellsOnline','Yes')} /> Yes</label>
                <label className="flex items-center gap-2"><input type="radio" name="online" checked={form.sellsOnline === 'No'} onChange={() => update('sellsOnline','No')} /> No</label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button className="px-4 py-2 bg-emerald-600 text-white rounded">Create Seller Profile</button>
            <div className="text-sm">Already have a seller account? <Link to="#" className="text-emerald-600">Sign in</Link></div>
          </div>
        </form>
      </div>
    </div>
  )
}

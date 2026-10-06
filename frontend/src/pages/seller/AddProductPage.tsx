import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import Sidebar from '../../components/dashboard/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { API_URL, getAuthHeaders } from '../../utils/api'

export default function AddProductPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    image: '',
    productType: 'perishable'
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(r => r.json())
      .then(data => {
        setCategories(data)
        if (data.length > 0) {
          setForm(f => ({ ...f, category: data[0]._id }))
        }
      })
      .catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity)
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to add product')
      }

      navigate('/seller-dashboard/products')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
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
          <DashboardHeader title="Add Product" onMenuToggle={() => setSidebarOpen(value => !value)} />

          <main className="flex-1 p-4 sm:p-6 max-w-3xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Add New Product</h2>
              <p className="text-slate-500">Fill in the details to list a new item on RootBridge.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded p-2 outline-emerald-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full border rounded p-2 outline-emerald-500"></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input required type="number" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border rounded p-2 outline-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity in Stock</label>
                    <input required type="number" min="0" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} className="w-full border rounded p-2 outline-emerald-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border rounded p-2 outline-emerald-500 bg-white">
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                    <select required value={form.productType} onChange={e => setForm({...form, productType: e.target.value})} className="w-full border rounded p-2 outline-emerald-500 bg-white">
                      <option value="perishable">Perishable (Fresh/Local)</option>
                      <option value="long_shelf_life">Long Shelf Life (Pantry)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input placeholder="https://..." value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full border rounded p-2 outline-emerald-500" />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-4 pt-4 border-t">
                <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700 disabled:opacity-70">
                  {loading ? 'Saving...' : 'Publish Product'}
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  )
}

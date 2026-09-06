import React, { useMemo, useState } from 'react'
import { Search, Trash2, X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import ProductCard from '../../components/dashboard/ProductCard'
import Sidebar from '../../components/dashboard/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { deleteProduct, getProducts } from '../../utils/products'
import type { SellerProduct } from '../../types'

export default function MyProductsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)

  const products = useMemo(
    () => (currentUser ? getProducts().filter(product => product.sellerId === currentUser.id) : []),
    [currentUser]
  )

  const categories = useMemo(() => Array.from(new Set(products.map(product => product.category).filter(Boolean))), [products])

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = !search || product.name.toLowerCase().includes(search.toLowerCase()) || product.category.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'all' || product.category === category
      const matchesStatus = status === 'all' || product.status === status
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [products, search, category, status])

  const handleDelete = (id: string) => {
    const target = products.find(product => product.id === id)
    if (!target) return
    if (!window.confirm('Are you sure you want to delete this product?')) return
    deleteProduct(id)
    setDeleteProductId(null)
    navigate(0)
  }

  const successMessage = (location.state as { successMessage?: string } | null)?.successMessage

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
          <DashboardHeader title="My Products" onMenuToggle={() => setSidebarOpen(value => !value)} />

          <main className="flex-1 p-4 sm:p-6">
            {successMessage && (
              <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {successMessage}
              </div>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <Search size={18} className="text-slate-400" />
                  <input
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    placeholder="Search products"
                    className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <select value={category} onChange={event => setCategory(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none">
                    <option value="all">All Categories</option>
                    {categories.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>

                  <select value={status} onChange={event => setStatus(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none">
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-slate-500">{filteredProducts.length} product(s)</p>
                <button type="button" onClick={() => navigate('/seller-dashboard/add-product')} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">+ Add New Product</button>
              </div>

              <div className="mt-5 space-y-4">
                {filteredProducts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    <p className="text-lg font-semibold text-slate-800">No products added yet.</p>
                    <button type="button" onClick={() => navigate('/seller-dashboard/add-product')} className="mt-4 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white">+ Add Your First Product</button>
                  </div>
                ) : (
                  filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={() => navigate(`/seller-dashboard/edit-product/${product.id}`)}
                      onDelete={() => setDeleteProductId(product.id)}
                    />
                  ))
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      {deleteProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Delete Product</h3>
              <button type="button" onClick={() => setDeleteProductId(null)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">Are you sure you want to delete this product?</p>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteProductId(null)} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              <button type="button" onClick={() => handleDelete(deleteProductId)} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

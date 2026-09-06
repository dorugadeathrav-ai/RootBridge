import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Boxes, Package, ShieldCheck, TrendingUp } from 'lucide-react'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import ProductCard from '../../components/dashboard/ProductCard'
import Sidebar from '../../components/dashboard/Sidebar'
import StatsCard from '../../components/dashboard/StatsCard'
import { useAuth } from '../../context/AuthContext'
import { getRegisteredUser } from '../../utils/auth'
import { deleteProduct, getProducts } from '../../utils/products'
import type { SellerProduct } from '../../types'

export default function SellerDashboardPage() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const seller = currentUser ? getRegisteredUser(currentUser.id) : null
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [products, setProducts] = useState<SellerProduct[]>([])

  useEffect(() => {
    setProducts(currentUser ? getProducts().filter(product => product.sellerId === currentUser.id) : [])
  }, [currentUser])

  const profile = seller?.profile as {
    businessName?: string
    location?: { state?: string; district?: string; taluka?: string; villageCity?: string; pinCode?: string }
  } | undefined

  const totalProducts = products.length
  const availableProducts = products.filter(product => product.status === 'available' && product.quantity > 0).length
  const outOfStockProducts = products.filter(product => product.status === 'out-of-stock' || product.quantity <= 0).length
  const totalOrders = products.length

  const handleDelete = (product: SellerProduct) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    deleteProduct(product.id)
    setProducts(previous => previous.filter(item => item.id !== product.id))
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
          <DashboardHeader title="Dashboard" onMenuToggle={() => setSidebarOpen(value => !value)} />

          <main className="flex-1 p-4 sm:p-6">
            <div className="mb-6 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 p-6 text-white shadow-lg shadow-emerald-800/20">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-emerald-100">Welcome back</p>
                  <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Welcome back, {seller?.name ?? currentUser?.name ?? 'Seller'}!</h2>
                </div>
                <button type="button" onClick={() => navigate('/seller-dashboard/add-product')} className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50">
                  + Add New Product
                </button>
              </div>
            </div>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatsCard title="Total Products" value={totalProducts} accent="bg-emerald-100 text-emerald-700" />
              <StatsCard title="Available Products" value={availableProducts} accent="bg-blue-100 text-blue-700" />
              <StatsCard title="Out of Stock Products" value={outOfStockProducts} accent="bg-amber-100 text-amber-700" />
              <StatsCard title="Total Orders" value={totalOrders} accent="bg-violet-100 text-violet-700" />
            </section>

            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">My Products</h3>
                  <p className="text-sm text-slate-500">Recently added items from your store.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => navigate('/seller-dashboard/products')} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">View All Products</button>
                  <button type="button" onClick={() => navigate('/seller-dashboard/add-product')} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">+ Add New Product</button>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {products.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Boxes size={28} />
                    </div>
                    <p className="text-lg font-semibold text-slate-800">No products added yet.</p>
                    <p className="mt-1 text-sm text-slate-500">Add your first product to start selling with RootBridge.</p>
                    <button type="button" onClick={() => navigate('/seller-dashboard/add-product')} className="mt-5 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">+ Add Your First Product</button>
                  </div>
                ) : (
                  products.slice(0, 3).map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={() => navigate(`/seller-dashboard/edit-product/${product.id}`)}
                      onDelete={() => handleDelete(product)}
                    />
                  ))
                )}
              </div>
            </section>

            {profile && (
              <section className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2 text-emerald-700">
                    <ShieldCheck size={18} />
                    <span className="text-sm font-semibold uppercase tracking-[0.2em]">Business</span>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{profile.businessName || 'Your Business'}</p>
                  <p className="mt-2 text-sm text-slate-500">{profile.location?.villageCity || 'Location pending'}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2 text-blue-700">
                    <TrendingUp size={18} />
                    <span className="text-sm font-semibold uppercase tracking-[0.2em]">Inventory</span>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{availableProducts} products ready</p>
                  <p className="mt-2 text-sm text-slate-500">{outOfStockProducts} items waiting for restock.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2 text-violet-700">
                    <Package size={18} />
                    <span className="text-sm font-semibold uppercase tracking-[0.2em]">Operations</span>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{totalOrders} tracked items</p>
                  <p className="mt-2 text-sm text-slate-500">Keep your catalog fresh and available.</p>
                </div>
              </section>
            )}

            {!seller && (
              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <div className="flex items-center gap-2">
                  <AlertCircle size={18} />
                  Seller profile is unavailable. Please sign in again.
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

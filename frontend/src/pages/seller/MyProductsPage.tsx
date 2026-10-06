import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Boxes } from 'lucide-react'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import ProductCard from '../../components/dashboard/ProductCard'
import Sidebar from '../../components/dashboard/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { API_URL, getAuthHeaders } from '../../utils/api'

export default function MyProductsPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = () => {
    setLoading(true)
    fetch(`${API_URL}/products/vendor`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(e => {
        console.error(e)
        setLoading(false)
      })
  }

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      if (res.ok) {
        setProducts(prev => prev.filter(p => p._id !== productId))
      }
    } catch (e) {
      console.error(e)
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
          <DashboardHeader title="My Products" onMenuToggle={() => setSidebarOpen(value => !value)} />

          <main className="flex-1 p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Product Inventory</h2>
                <p className="text-slate-500">Manage your catalog, pricing, and stock.</p>
              </div>
              <button onClick={() => navigate('/seller-dashboard/add-product')} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                + Add New Product
              </button>
            </div>

            {loading ? (
              <p>Loading products...</p>
            ) : products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Boxes size={28} />
                </div>
                <p className="text-lg font-semibold text-slate-800">No products added yet.</p>
                <p className="mt-1 text-sm text-slate-500">Start adding products to sell.</p>
                <button onClick={() => navigate('/seller-dashboard/add-product')} className="mt-5 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                  + Add Your First Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map(product => (
                  <ProductCard
                    key={product._id}
                    product={{...product, id: product._id, status: product.quantity > 0 ? 'available' : 'out-of-stock'}}
                    onEdit={() => navigate(`/seller-dashboard/edit-product/${product._id}`)}
                    onDelete={() => handleDelete(product._id)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

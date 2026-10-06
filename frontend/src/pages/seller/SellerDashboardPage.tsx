import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Boxes, Package, ShieldCheck, TrendingUp } from 'lucide-react'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import Sidebar from '../../components/dashboard/Sidebar'
import StatsCard from '../../components/dashboard/StatsCard'
import { useAuth } from '../../context/AuthContext'
import { API_URL, getAuthHeaders } from '../../utils/api'

export default function SellerDashboardPage() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/products/vendor`, { headers: getAuthHeaders() }).then(r => r.json()),
      fetch(`${API_URL}/orders/vendor`, { headers: getAuthHeaders() }).then(r => r.json())
    ]).then(([p, o]) => {
      setProducts(p || [])
      setOrders(o || [])
      setLoading(false)
    }).catch(e => {
      console.error(e)
      setLoading(false)
    })
  }, [])

  const totalProducts = products.length
  const availableProducts = products.filter(product => product.quantity > 0).length
  const outOfStockProducts = products.filter(product => product.quantity <= 0).length
  const totalOrders = orders.length
  
  // Calculate total sales
  const totalSales = orders.reduce((sum, order) => {
    // Only count products belonging to this vendor
    const vendorItems = order.products.filter((p: any) => p.vendor === currentUser?._id)
    const itemTotal = vendorItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)
    return sum + itemTotal
  }, 0)

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
                  <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Welcome back, {currentUser?.name || 'Vendor'}!</h2>
                </div>
                <button type="button" onClick={() => navigate('/seller-dashboard/add-product')} className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50">
                  + Add New Product
                </button>
              </div>
            </div>

            {loading ? (
              <p>Loading dashboard data...</p>
            ) : (
              <>
                <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <StatsCard title="Total Products" value={totalProducts} accent="bg-emerald-100 text-emerald-700" />
                  <StatsCard title="Total Orders" value={totalOrders} accent="bg-blue-100 text-blue-700" />
                  <StatsCard title="Low/Out of Stock" value={outOfStockProducts} accent="bg-amber-100 text-amber-700" />
                  <StatsCard title="Total Sales" value={`₹${totalSales}`} accent="bg-violet-100 text-violet-700" />
                </section>

                <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Recent Orders</h3>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No orders yet.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="p-3 font-semibold text-sm text-gray-600">Order ID</th>
                            <th className="p-3 font-semibold text-sm text-gray-600">Date</th>
                            <th className="p-3 font-semibold text-sm text-gray-600">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 5).map(order => (
                            <tr key={order._id} className="border-b">
                              <td className="p-3 text-sm font-mono">{order._id.substring(0, 8)}...</td>
                              <td className="p-3 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                              <td className="p-3 text-sm">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                  order.orderStatus === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                  order.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {order.orderStatus}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <button onClick={() => navigate('/seller-dashboard/orders')} className="mt-4 text-emerald-600 text-sm font-medium hover:underline">View All Orders</button>
                </section>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

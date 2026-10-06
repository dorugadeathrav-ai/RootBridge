import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import Sidebar from '../../components/dashboard/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { API_URL, getAuthHeaders } from '../../utils/api'

export default function SellerOrdersPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = () => {
    setLoading(true)
    fetch(`${API_URL}/orders/vendor`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(data => {
        setOrders(data)
        setLoading(false)
      })
      .catch(e => {
        console.error(e)
        setLoading(false)
      })
  }

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        fetchOrders()
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
          <DashboardHeader title="Orders" onMenuToggle={() => setSidebarOpen(value => !value)} />

          <main className="flex-1 p-4 sm:p-6">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Manage Orders</h2>
            
            {loading ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border p-8 text-center text-gray-500">
                You have no orders yet.
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order._id} className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex flex-col md:flex-row justify-between mb-4 border-b pb-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                        <p className="font-semibold text-gray-900">Customer: {order.customerId?.name}</p>
                        <p className="text-sm text-gray-600">Email: {order.customerId?.email} | Phone: {order.customerId?.phone}</p>
                        <p className="text-sm text-gray-600 mt-2">
                          Address: {order.deliveryAddress?.address}, {order.deliveryAddress?.city} - {order.deliveryAddress?.postalCode}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Date: {new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-bold text-lg text-emerald-700">Total: ₹{order.totalAmount}</span>
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium">Status:</label>
                          <select 
                            value={order.orderStatus}
                            onChange={(e) => updateStatus(order._id, e.target.value)}
                            className="border rounded p-1.5 text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Products in this order:</h4>
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="bg-gray-50 text-gray-600">
                            <th className="p-2 border-b">Product</th>
                            <th className="p-2 border-b text-center">Qty</th>
                            <th className="p-2 border-b text-right">Price</th>
                            <th className="p-2 border-b text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.products.map((item: any) => (
                            <tr key={item._id} className="border-b">
                              <td className="p-2">{item.product?.name || 'Unknown Product'}</td>
                              <td className="p-2 text-center">{item.quantity}</td>
                              <td className="p-2 text-right">₹{item.price}</td>
                              <td className="p-2 text-right">₹{item.price * item.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react';
import { API_URL, getAuthHeaders } from '../../utils/api';
import { Users, Store, Package, ShoppingCart } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ customers: 0, vendors: 0, products: 0, orders: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/users`, { headers: getAuthHeaders() }).then(r => r.json()),
      fetch(`${API_URL}/products`, { headers: getAuthHeaders() }).then(r => r.json()),
      fetch(`${API_URL}/orders/all`, { headers: getAuthHeaders() }).then(r => r.json())
    ]).then(([users, products, orders]) => {
      if (Array.isArray(users)) {
        const customers = users.filter((u: any) => u.role === 'customer').length;
        const vendors = users.filter((u: any) => u.role === 'vendor').length;
        setStats({ customers, vendors, products: products.length || 0, orders: orders.length || 0 });
      }
      if (Array.isArray(orders)) {
        setRecentOrders(orders.slice(0, 5));
      }
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Marketplace Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Customers" value={stats.customers} icon={Users} color="bg-blue-50 text-blue-600" />
        <StatCard title="Total Vendors" value={stats.vendors} icon={Store} color="bg-amber-50 text-amber-600" />
        <StatCard title="Total Products" value={stats.products} icon={Package} color="bg-emerald-50 text-emerald-600" />
        <StatCard title="Total Orders" value={stats.orders} icon={ShoppingCart} color="bg-purple-50 text-purple-600" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3 font-semibold">Order ID</th>
                  <th className="p-3 font-semibold">Customer</th>
                  <th className="p-3 font-semibold">Amount</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-3 font-mono text-gray-500">{order._id.substring(0, 8)}...</td>
                    <td className="p-3 font-medium">{order.customerId?.name || 'Unknown'}</td>
                    <td className="p-3 font-medium">₹{order.totalAmount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        order.orderStatus === 'Pending' ? 'bg-amber-100 text-amber-800' :
                        order.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 flex items-center gap-4">
      <div className={`p-4 rounded-full ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

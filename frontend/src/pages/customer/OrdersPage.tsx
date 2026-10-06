import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL, getAuthHeaders } from '../../utils/api';
import { Package, Calendar } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/orders`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center">Loading orders...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">You haven't placed any orders.</p>
          <Link to="/products" className="bg-emerald-600 text-white font-bold py-2 px-6 rounded hover:bg-emerald-700">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b pb-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div className="font-mono text-xs text-gray-400">Order #{order._id}</div>
                </div>
                <div className="mt-4 sm:mt-0 text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    order.orderStatus === 'Pending' ? 'bg-amber-100 text-amber-800' :
                    order.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.orderStatus}
                  </span>
                  <div className="font-bold text-lg text-gray-900 mt-1">₹{order.totalAmount}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-gray-900">Items</h4>
                {order.products.map((item: any) => (
                  <div key={item._id || Math.random()} className="flex justify-between text-sm items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-medium">{item.product?.name || 'Unknown Product'}</span>
                      <span className="text-gray-400 text-xs">x{item.quantity}</span>
                    </div>
                    <span className="font-medium text-gray-800">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { API_URL, getAuthHeaders } from '../../utils/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    fetch(`${API_URL}/orders/all`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
        }
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Marketplace Orders</h1>
      
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No orders found in the system.</div>
        ) : (
          orders.map(order => (
            <div key={order._id} className="border rounded-lg p-5">
              <div className="flex flex-col md:flex-row justify-between mb-4 border-b pb-4 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-mono text-sm text-gray-500">#{order._id}</p>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      order.orderStatus === 'Pending' ? 'bg-amber-100 text-amber-800' :
                      order.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 mt-2">Customer: {order.customerId?.name}</p>
                  <p className="text-sm text-gray-600">{order.customerId?.email}</p>
                  <p className="text-sm text-gray-500 mt-1">Ordered on: {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                
                <div className="flex flex-col md:items-end gap-1 text-sm">
                  <div className="font-bold text-lg text-emerald-700">Total: ₹{order.totalAmount}</div>
                  <div className="text-gray-600 max-w-xs md:text-right">
                    <span className="font-medium">Deliver to: </span>
                    {order.deliveryAddress?.address}, {order.deliveryAddress?.city} - {order.deliveryAddress?.postalCode}
                  </div>
                </div>
              </div>
              
              <div>
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600">
                      <th className="p-2 border-b">Product</th>
                      <th className="p-2 border-b">Vendor</th>
                      <th className="p-2 border-b text-center">Qty</th>
                      <th className="p-2 border-b text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((item: any) => (
                      <tr key={item._id} className="border-b last:border-0">
                        <td className="p-2">{item.product?.name || 'Unknown Product'}</td>
                        <td className="p-2 text-emerald-700 font-medium">{item.vendor?.vendorInfo?.businessName || item.vendor?.name || 'Unknown'}</td>
                        <td className="p-2 text-center">{item.quantity}</td>
                        <td className="p-2 text-right">₹{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

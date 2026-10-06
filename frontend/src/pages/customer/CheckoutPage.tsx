import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { API_URL, getAuthHeaders } from '../../utils/api';

export default function CheckoutPage() {
  const { items, clearCartLocally } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'India'
  });

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          deliveryAddress: {
            address: address.street,
            city: address.city,
            postalCode: address.postalCode,
            country: address.country
          }
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order failed');

      clearCartLocally();
      navigate('/orders');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Form */}
        <div className="w-full md:w-2/3">
          <form onSubmit={handlePlaceOrder} className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Delivery Details</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                  <input required value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} className="w-full border rounded p-2 outline-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Phone</label>
                  <input required value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="w-full border rounded p-2 outline-emerald-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Street Address</label>
                <input required value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="w-full border rounded p-2 outline-emerald-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">City</label>
                  <input required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full border rounded p-2 outline-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">PIN Code</label>
                  <input required value={address.postalCode} onChange={e => setAddress({...address, postalCode: e.target.value})} className="w-full border rounded p-2 outline-emerald-500" />
                </div>
              </div>
            </div>

            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4 border-b pb-2">Payment Method</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" defaultChecked className="text-emerald-600" />
                <span className="font-medium text-gray-900">Cash on Delivery</span>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded cursor-not-allowed opacity-50">
                <input type="radio" name="payment" disabled />
                <span className="font-medium text-gray-900">Online Payment (Demo)</span>
              </label>
            </div>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

            <button disabled={loading} className="w-full mt-8 bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition disabled:opacity-70">
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Summary */}
        <div className="w-full md:w-1/3">
          <div className="bg-gray-50 rounded-xl border p-6 sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4 border-b pb-2">Order Items</h2>
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.product._id} className="flex justify-between text-sm">
                  <span className="text-gray-600 line-clamp-1 pr-2">{item.quantity}x {item.product.name}</span>
                  <span className="font-medium text-gray-900">₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-emerald-700">₹{subtotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, isLoading } = useCart();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-sm border p-12 max-w-lg mx-auto flex flex-col items-center">
          <div className="h-24 w-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="h-10 w-10 text-emerald-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any fresh products yet.</p>
          <Link to="/products" className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-full hover:bg-emerald-700 transition">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3 space-y-4">
          {items.map(item => (
            <div key={item.product._id} className="bg-white rounded-xl shadow-sm border p-4 flex gap-4">
              <div className="w-24 h-24 bg-gray-50 rounded border shrink-0 flex items-center justify-center">
                {item.product.image ? (
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover rounded" />
                ) : (
                  <ShoppingBag className="h-8 w-8 text-gray-300" />
                )}
              </div>
              
              <div className="flex-grow flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{item.product.name}</h3>
                    <p className="text-emerald-600 font-medium">₹{item.product.price}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.product._id)}
                    className="text-red-400 hover:text-red-600 p-1"
                    title="Remove item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded h-9 bg-gray-50">
                    <button 
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      disabled={isLoading}
                      className="px-3 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      disabled={isLoading}
                      className="px-3 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Total: ₹{item.product.price * item.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
            </div>
            
            <div className="border-t pt-4 mb-8">
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>₹{subtotal}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Including all taxes</p>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition shadow-sm"
            >
              Proceed to Checkout
            </button>
            <Link to="/products" className="block text-center mt-4 text-emerald-600 text-sm hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

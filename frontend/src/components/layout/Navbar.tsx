import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, User, LogOut, Search } from 'lucide-react';

export default function Navbar() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-emerald-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold tracking-tight">RootBridge</Link>
            <div className="hidden md:flex gap-6 text-emerald-100 font-medium">
              <Link to="/" className="hover:text-white">Home</Link>
              <Link to="/products" className="hover:text-white">Products</Link>
              <Link to="/products?category=all" className="hover:text-white">Categories</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <form onSubmit={(e) => { e.preventDefault(); navigate('/products?search=' + (e.target as any).search.value) }} className="hidden md:flex relative text-gray-800">
              <input name="search" type="text" placeholder="Search products..." className="pl-10 pr-4 py-1.5 rounded-full text-sm w-48 lg:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
              <Search className="absolute left-3 top-2 h-4 w-4 text-gray-500" />
            </form>

            <Link to="/cart" className="relative text-emerald-50 hover:text-white">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="group relative flex items-center gap-2 cursor-pointer text-emerald-50 hover:text-white">
                <User className="h-6 w-6" />
                <span className="hidden sm:block font-medium truncate max-w-[100px]">{currentUser?.name}</span>
                
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all text-gray-800">
                  <div className="px-4 py-3 border-b text-sm">
                    <p className="font-semibold text-emerald-700">{currentUser?.name}</p>
                    <p className="text-gray-500 truncate">{currentUser?.email}</p>
                  </div>
                  <div className="p-2 text-sm">
                    <Link to={currentUser?.role === 'customer' || currentUser?.role === 'buyer' ? '/buyer-dashboard' : '/seller-dashboard'} className="block px-3 py-2 rounded hover:bg-emerald-50 text-emerald-800">
                      Dashboard
                    </Link>
                    <Link to="/orders" className="block px-3 py-2 rounded hover:bg-emerald-50 text-emerald-800">
                      My Orders
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded hover:bg-red-50 text-red-600 mt-1">
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="font-medium text-emerald-50 hover:text-white flex items-center gap-2 border border-emerald-500/50 bg-emerald-600/50 hover:bg-emerald-600 px-4 py-1.5 rounded-full transition-colors">
                <User className="h-4 w-4" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

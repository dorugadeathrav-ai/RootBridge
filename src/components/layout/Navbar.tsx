import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Home, Search } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-2xl font-semibold text-emerald-600">RootBridge</Link>
            <span className="text-sm text-slate-500">Bridging Local Excellence to Global Opportunities.</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link to="/buyer" className="hover:text-slate-800">Home</Link>
            <Link to="#" className="hover:text-slate-800">Categories</Link>
            <div className="flex items-center gap-3">
              <Search size={16} />
              <input placeholder="Search products, brands or categories..." className="hidden md:inline-block bg-transparent outline-none" />
            </div>
            <Link to="#" className="flex items-center gap-1"><Heart size={16} /></Link>
            <Link to="#" className="flex items-center gap-1"><ShoppingCart size={16} /></Link>
            <Link to="#" className="px-3 py-1 rounded bg-slate-100">Profile</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

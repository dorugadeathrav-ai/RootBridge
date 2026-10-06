import React from 'react'
import { MapPin, ShoppingCart, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Product } from '../../types'
import { useAuth } from '../../context/AuthContext'

export default function ProductCard({ p }: { p: Product }) {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  function addToCart() {
    if (!currentUser) {
      navigate('/login', { state: { from: '/buyer' } })
      return
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="h-40 overflow-hidden bg-gradient-to-br from-emerald-100 to-emerald-50">
        {p.image ? (
          <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-2xl font-semibold text-emerald-700">{p.name.slice(0, 1).toUpperCase()}</div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">{p.category ?? 'Local Product'}</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">{p.name}</h3>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Sold by: {p.seller}</span>
          <span className="inline-flex items-center gap-1 text-amber-500"><Star size={14} fill="currentColor" /> {p.rating}</span>
        </div>

        <div className="flex items-center gap-1 text-sm text-slate-600"><MapPin size={14} className="text-emerald-700" /> {p.location}</div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900">₹{Number(p.price).toFixed(2)}</div>
            <div className="text-xs text-slate-500">{p.unit ?? 'unit'} · Qty: {p.quantity ?? 0}</div>
          </div>
        </div>

        <p className="text-sm text-slate-600">{p.description || 'Fresh local product from a trusted seller.'}</p>

        <div className="flex gap-2 pt-2">
          <button type="button" className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">View Details</button>
          <button type="button" onClick={addToCart} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            <ShoppingCart size={15} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

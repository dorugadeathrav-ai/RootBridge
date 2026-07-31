import React from 'react'
import type { Product } from '../../types'

export default function ProductCard({ p }: { p: Product }) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="h-40 bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
        <div className="text-2xl text-emerald-600">Image</div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-800">{p.name}</h3>
        <p className="text-sm text-slate-500">{p.seller} · {p.location}</p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold">₹{p.price.toFixed(2)}</div>
            <div className="text-sm text-yellow-600">⭐ {p.rating}</div>
          </div>
          <div className="flex flex-col gap-2">
            <button className="px-3 py-1 bg-emerald-600 text-white rounded">Add to Cart</button>
            <button className="px-3 py-1 border rounded">View Details</button>
          </div>
        </div>
      </div>
    </div>
  )
}

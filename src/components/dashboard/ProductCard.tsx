import React from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import type { SellerProduct } from '../../types'

export default function ProductCard({ product, onEdit, onDelete }: { product: SellerProduct; onEdit: () => void; onDelete: () => void }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:flex-row">
      <div className="h-40 w-full overflow-hidden bg-slate-100 sm:h-auto sm:w-44">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-emerald-50 text-sm font-medium text-emerald-700">No Image</div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
              <p className="text-sm text-slate-500">{product.category}</p>
            </div>
            <span className={['rounded-full px-2.5 py-1 text-xs font-medium', product.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'].join(' ')}>
              {product.status === 'available' ? 'Available' : 'Out of Stock'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 sm:grid-cols-4">
            <div><span className="block text-[11px] uppercase tracking-[0.14em] text-slate-400">Price</span>₹{product.price}</div>
            <div><span className="block text-[11px] uppercase tracking-[0.14em] text-slate-400">Unit</span>{product.unit}</div>
            <div><span className="block text-[11px] uppercase tracking-[0.14em] text-slate-400">Qty</span>{product.quantity}</div>
            <div><span className="block text-[11px] uppercase tracking-[0.14em] text-slate-400">Status</span>{product.status}</div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={onEdit} className="inline-flex items-center gap-2 rounded-lg border border-emerald-700 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100">
            <Pencil size={14} /> Edit Product
          </button>
          <button type="button" onClick={onDelete} className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </article>
  )
}

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Store } from 'lucide-react'

export default function RoleSelection() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-700">RootBridge</h1>
          <p className="mt-2 text-slate-600">Bridging Local Excellence to Global Opportunities.</p>
          <h2 className="mt-6 text-3xl font-semibold">Welcome to RootBridge</h2>
          <p className="text-slate-500 mt-2">Discover local excellence or grow your business with a marketplace built for everyone.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex flex-col">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded bg-emerald-50">
                <ShoppingBag size={28} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Continue as Buyer</h3>
                <p className="text-sm text-slate-500">Discover products from trusted local brands, farmers, artisans and small businesses.</p>
              </div>
            </div>
            <div className="mt-auto pt-6">
              <button onClick={() => nav('/buyer')} className="w-full px-4 py-3 bg-emerald-600 text-white rounded">Shop as Buyer</button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex flex-col">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded bg-emerald-50">
                <Store size={28} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Continue as Seller</h3>
                <p className="text-sm text-slate-500">Bring your products online and connect with customers beyond your local market.</p>
              </div>
            </div>
            <div className="mt-auto pt-6">
              <button onClick={() => nav('/seller/register')} className="w-full px-4 py-3 border border-emerald-600 text-emerald-600 rounded">Sell with RootBridge</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

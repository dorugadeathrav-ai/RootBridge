import React from 'react'
import Navbar from '../components/layout/Navbar'
import { products } from '../data/products'
import ProductCard from '../components/buyer/ProductCard'

export default function BuyerHome() {
  return (
    <div>
      <Navbar />
      <main className="max-w-7xl mx-auto p-6">
        <section className="bg-white rounded-lg p-8 shadow-sm mb-6">
          <h1 className="text-3xl font-semibold">Discover Products with a Story</h1>
          <p className="text-slate-600 mt-2">Shop authentic products from local brands, farmers, artisans and growing businesses.</p>
          <div className="mt-4">
            <input className="w-full p-3 rounded border" placeholder="Search products, brands or categories..." />
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {['Fresh Produce','Jaggery & Sweeteners','Organic Foods','Handicrafts','Handloom','Homemade Foods','Spices','Dairy','Local Brands'].map(c => (
              <div key={c} className="px-4 py-2 rounded bg-white shadow-sm">{c}</div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Local Brands</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded shadow-sm">Kolhapur Farms</div>
            <div className="bg-white p-4 rounded shadow-sm">Golden Roots</div>
            <div className="bg-white p-4 rounded shadow-sm">Bamboo Crafts</div>
            <div className="bg-white p-4 rounded shadow-sm">Hill Apiaries</div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Why RootBridge?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded shadow-sm">Authentic Local Products</div>
            <div className="bg-white p-6 rounded shadow-sm">Trusted Sellers</div>
            <div className="bg-white p-6 rounded shadow-sm">Direct Market Access</div>
            <div className="bg-white p-6 rounded shadow-sm">Supporting Local Businesses</div>
          </div>
        </section>
      </main>
    </div>
  )
}

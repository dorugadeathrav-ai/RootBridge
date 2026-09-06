import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import ProductCard from '../components/buyer/ProductCard'
import LogoutButton from '../components/LogoutButton'
import { useAuth } from '../context/AuthContext'
import { getVisibleBuyerProducts } from '../utils/products'
import { getUsers } from '../utils/auth'

export default function BuyerHome() {
  const { currentUser } = useAuth()
  const [products, setProducts] = useState(() => getVisibleBuyerProducts())

  useEffect(() => {
    setProducts(getVisibleBuyerProducts())
  }, [])

  const sellersById = useMemo(() => {
    return Object.fromEntries(getUsers().map(user => [user.id, user]))
  }, [])

  return (
    <div>
      <Navbar />
      {currentUser && <div className="mx-auto flex max-w-7xl justify-end px-6 pt-4"><LogoutButton /></div>}
      <main className="mx-auto max-w-7xl p-6">
        <section className="mb-6 rounded-lg bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold">Discover Products with a Story</h1>
          <p className="mt-2 text-slate-600">Shop authentic products from local brands, farmers, artisans and growing businesses.</p>
          <div className="mt-4">
            <input className="w-full rounded border p-3" placeholder="Search products, brands or categories..." />
          </div>
        </section>

        <section className="mb-6">
          <h2 className="mb-4 text-xl font-semibold">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {['Fresh Produce', 'Jaggery & Sweeteners', 'Organic Foods', 'Handicrafts', 'Handloom', 'Homemade Foods', 'Spices', 'Dairy', 'Local Brands'].map(c => (
              <div key={c} className="rounded bg-white px-4 py-2 shadow-sm">{c}</div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Featured Products</h2>
          {products.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">No products available yet.</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {products.map(product => {
                const seller = sellersById[product.sellerId]
                return (
                  <ProductCard
                    key={product.id}
                    p={{
                      id: product.id,
                      name: product.name,
                      seller: seller?.name ?? 'RootBridge Seller',
                      location: `${product.location.villageCity || ''}${product.location.villageCity ? ', ' : ''}${product.location.state || ''}`,
                      price: Number(product.price),
                      rating: 4.8,
                      image: product.images[0],
                      description: product.description,
                      sellerId: product.sellerId,
                      category: product.category,
                      unit: product.unit,
                      quantity: product.quantity,
                      productLocation: product.location,
                      isAvailable: product.status === 'available'
                    }}
                  />
                )
              })}
            </div>
          )}
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Local Brands</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded bg-white p-4 shadow-sm">Kolhapur Farms</div>
            <div className="rounded bg-white p-4 shadow-sm">Golden Roots</div>
            <div className="rounded bg-white p-4 shadow-sm">Bamboo Crafts</div>
            <div className="rounded bg-white p-4 shadow-sm">Hill Apiaries</div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-4 text-2xl font-semibold">Why RootBridge?</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded bg-white p-6 shadow-sm">Authentic Local Products</div>
            <div className="rounded bg-white p-6 shadow-sm">Trusted Sellers</div>
            <div className="rounded bg-white p-6 shadow-sm">Direct Market Access</div>
            <div className="rounded bg-white p-6 shadow-sm">Supporting Local Businesses</div>
          </div>
        </section>
      </main>
    </div>
  )
}

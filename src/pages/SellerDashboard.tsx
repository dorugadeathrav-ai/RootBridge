import React from 'react'
import { mockSeller } from '../data/mockSellers'

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}

export default function SellerDashboard() {
  const raw = localStorage.getItem('rb_seller')
  const seller = raw ? JSON.parse(raw) : mockSeller

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Welcome to RootBridge, {seller.fullName || seller.businessName}</h1>
            <p className="text-slate-600">Overview of your store</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <StatCard title="Products" value={12} />
          <StatCard title="Orders" value={5} />
          <StatCard title="Total Sales" value={'₹ 3,450'} />
          <StatCard title="Customer Rating" value={'4.6'} />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1 bg-white p-4 rounded shadow-sm">
            <ul className="space-y-2 text-sm">
              <li className="font-medium">Dashboard</li>
              <li>My Products</li>
              <li>Add Product</li>
              <li>Orders</li>
              <li>Inventory</li>
              <li>Analytics</li>
              <li>Profile</li>
              <li className="text-red-600">Logout</li>
            </ul>
          </aside>

          <div className="md:col-span-3">
            <div className="bg-white p-4 rounded shadow-sm">
              <h3 className="font-semibold">Recent Activity</h3>
              <p className="text-sm text-slate-500 mt-2">No recent orders — use this space to show new orders, messages or product views.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

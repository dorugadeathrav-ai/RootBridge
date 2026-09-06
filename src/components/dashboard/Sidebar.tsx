import React from 'react'
import { NavLink } from 'react-router-dom'
import { BarChart3, Boxes, ClipboardList, LogOut, Menu, PlusCircle, Store, User, X } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', to: '/seller-dashboard', icon: BarChart3 },
  { label: 'My Products', to: '/seller-dashboard/products', icon: Boxes },
  { label: 'Add Product', to: '/seller-dashboard/add-product', icon: PlusCircle },
  { label: 'Orders', to: '/seller-dashboard', icon: ClipboardList },
  { label: 'My Profile', to: '/seller-dashboard/profile', icon: User }
]

export default function Sidebar({ open, onToggle, onLogout }: { open: boolean; onToggle: () => void; onLogout: () => void }) {
  const content = (
    <aside
      className={[
        'fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-[#f8faf8] p-5 shadow-xl shadow-slate-200/60 transition-transform duration-300 lg:static lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-lg font-bold text-white shadow-lg shadow-emerald-700/20">R</div>
          <div>
            <p className="text-lg font-bold tracking-tight text-emerald-950">RootBridge</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Seller Hub</p>
          </div>
        </div>
        <button type="button" className="rounded-lg p-2 text-slate-600 hover:bg-slate-200 lg:hidden" onClick={onToggle} aria-label="Close sidebar">
          <X size={18} />
        </button>
      </div>

      <nav className="mt-8 space-y-2">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => {
              if (window.innerWidth < 1024) onToggle()
            }}
            className={({ isActive }) => [
              'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all',
              isActive ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/20' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
            ].join(' ')}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700/10 text-emerald-700">
            <Store size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-950">Business Growth</p>
            <p className="text-xs text-slate-500">Packages & sales</p>
          </div>
        </div>
      </div>

      <button type="button" onClick={onLogout} className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100">
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  )

  return (
    <>
      <button type="button" className="fixed left-4 top-4 z-50 rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm lg:hidden" onClick={onToggle} aria-label="Open sidebar">
        <Menu size={18} />
      </button>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden" onClick={onToggle} />}
      {content}
    </>
  )
}

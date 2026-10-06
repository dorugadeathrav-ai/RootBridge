import React, { useState } from 'react'
import { Bell, ChevronDown, LogOut, Menu, Settings, User, UserCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function DashboardHeader({ title, onMenuToggle }: { title: string; onMenuToggle: () => void }) {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button type="button" className="rounded-lg border border-slate-200 p-2 text-slate-700 lg:hidden" onClick={onMenuToggle} aria-label="Open menu">
            <Menu size={18} />
          </button>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Seller Portal</p>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button type="button" className="relative rounded-full border border-slate-200 bg-slate-50 p-2.5 text-slate-600 transition hover:bg-slate-100" aria-label="Notifications">
            <Bell size={18} />
            <span className="absolute right-2 top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-600" />
          </button>

          <div className="relative">
            <button type="button" onClick={() => setMenuOpen(value => !value)} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 text-left shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-white">
                <UserCircle2 size={20} />
              </span>
              <span className="hidden sm:block">
                <span className="block text-sm font-semibold text-slate-800">{currentUser?.name ?? 'Seller'}</span>
                <span className="block text-[11px] text-slate-500">Seller account</span>
              </span>
              <ChevronDown size={16} className="text-slate-500" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                <button type="button" onClick={() => { setMenuOpen(false); navigate('/seller-dashboard/profile') }} className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50">
                  <User size={16} /> My Profile
                </button>
                <button type="button" className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50">
                  <Settings size={16} /> Settings
                </button>
                <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 border-t border-slate-200 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

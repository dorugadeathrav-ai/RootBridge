import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, ShoppingBag, Store } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function RoleSelection() {
  const nav = useNavigate()
  const { currentUser } = useAuth()

  useEffect(() => {
    if (currentUser) nav(currentUser.role === 'buyer' ? '/buyer-dashboard' : '/seller-dashboard', { replace: true })
  }, [currentUser, nav])

  return (
    <div className="home-shell min-h-screen w-full overflow-hidden">
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#fbfaf5]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />

        <header className="relative flex items-center justify-between px-6 py-5 sm:px-10 lg:px-14">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-lg shadow-emerald-700/20"><span className="text-lg font-bold">R</span></div>
            <div><h1 className="text-xl font-bold tracking-tight text-emerald-950">RootBridge</h1><p className="hidden text-xs text-slate-500 sm:block">Local roots. Wider reach.</p></div>
          </div>
          <span className="rounded-full border border-emerald-900/10 bg-white/60 px-3 py-1.5 text-xs font-medium text-emerald-800">Made for local enterprise</span>
        </header>

        <main className="relative flex flex-1 flex-col justify-center px-6 pb-10 pt-8 sm:px-10 lg:px-14 lg:pb-14">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">A marketplace with meaning</p>
            <h2 className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight text-emerald-950 sm:text-6xl">Good products deserve a bigger table.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">Discover the people and craft behind every product, or take your own local business to customers everywhere.</p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="role-card group flex flex-col rounded-2xl bg-emerald-800 p-6 text-white shadow-xl shadow-emerald-900/15 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/25 sm:p-7">
              <div className="flex items-start justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/70 ring-1 ring-white/20"><ShoppingBag size={24} /></div><ArrowRight size={22} className="transition-transform duration-300 group-hover:translate-x-1" /></div>
              <h3 className="mt-8 text-2xl font-semibold">Shop with purpose</h3><p className="mt-2 max-w-sm text-sm leading-6 text-emerald-100">Find authentic goods from farmers, artisans, and independent brands.</p>
              <div className="mt-6 flex items-center gap-2 text-sm text-emerald-50"><Check size={16} /> Discover something real</div>
              <button onClick={() => nav('/buyer')} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-emerald-800 transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-800">Shop as Buyer <ArrowRight size={17} /></button>
            </div>

            <div className="role-card group flex flex-col rounded-2xl border border-amber-200 bg-amber-50/80 p-6 text-emerald-950 shadow-xl shadow-amber-950/5 transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-2xl sm:p-7">
              <div className="flex items-start justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-200 text-amber-900 ring-1 ring-amber-300/70"><Store size={24} /></div><ArrowRight size={22} className="text-emerald-800 transition-transform duration-300 group-hover:translate-x-1" /></div>
              <h3 className="mt-8 text-2xl font-semibold">Grow your reach</h3><p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">Bring your products online and connect with customers beyond your local market.</p>
              <div className="mt-6 flex items-center gap-2 text-sm text-emerald-800"><Check size={16} /> Build your next chapter</div>
              <button onClick={() => nav('/seller/register')} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-800 bg-transparent px-4 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2">Sell with RootBridge <ArrowRight size={17} /></button>
            </div>
          </div>
          <p className="mt-8 text-center text-xs font-medium uppercase tracking-[0.18em] text-slate-400">From local hands to wider horizons</p>
        </main>
      </div>
    </div>
  )
}

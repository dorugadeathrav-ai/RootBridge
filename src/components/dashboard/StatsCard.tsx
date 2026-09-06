import React from 'react'

export default function StatsCard({ title, value, accent }: { title: string; value: string | number; accent?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <span className={['inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold', accent ?? 'bg-emerald-100 text-emerald-700'].join(' ')}>{String(value).length > 2 ? '•' : value}</span>
      </div>
      <div className="mt-5 text-3xl font-bold tracking-tight text-slate-900">{value}</div>
    </div>
  )
}

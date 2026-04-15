const statusStyles = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 ring-rose-200',
  active: 'bg-sky-50 text-sky-700 ring-sky-200',
  inactive: 'bg-slate-100 text-slate-600 ring-slate-200',
}

export default function ClientStatusPill({ label }) {
  const value = String(label ?? 'pending').toLowerCase()
  const classes = statusStyles[value] ?? 'bg-slate-100 text-slate-600 ring-slate-200'

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-semibold capitalize tracking-wide ring-1 ${classes}`}>
      {String(label ?? 'pending').replace('_', ' ')}
    </span>
  )
}

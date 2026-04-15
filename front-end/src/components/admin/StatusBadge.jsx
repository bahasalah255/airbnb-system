const statusMap = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  inactive: 'bg-rose-50 text-rose-700 ring-rose-200',
  admin: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  owner: 'bg-sky-50 text-sky-700 ring-sky-200',
  client: 'bg-amber-50 text-amber-700 ring-amber-200',
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 ring-rose-200',
}

export default function StatusBadge({ label }) {
  const key = String(label).toLowerCase()
  const classes = statusMap[key] ?? 'bg-slate-100 text-slate-700 ring-slate-200'

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.68rem] font-semibold capitalize tracking-wide ring-1 ${classes}`}>
      {String(label).replace('_', ' ')}
    </span>
  )
}

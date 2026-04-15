export default function ClientMetricCard({ title, value, note, accent = 'slate' }) {
  const accentStyles = {
    amber: 'from-amber-100 via-amber-50 to-white text-amber-700 ring-amber-100',
    sky: 'from-sky-100 via-sky-50 to-white text-sky-700 ring-sky-100',
    emerald: 'from-emerald-100 via-emerald-50 to-white text-emerald-700 ring-emerald-100',
    rose: 'from-rose-100 via-rose-50 to-white text-rose-700 ring-rose-100',
    slate: 'from-slate-100 via-slate-50 to-white text-slate-700 ring-slate-100',
  }

  const accentClass = accentStyles[accent] ?? accentStyles.slate

  return (
    <article className={`rounded-[1.6rem] border border-slate-200/70 bg-gradient-to-br ${accentClass} p-5 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.55)]`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[2rem]">{value}</p>
        <span className="rounded-full bg-white/80 px-2.5 py-1 text-[0.7rem] font-semibold text-slate-600 ring-1 ring-white/70">
          Client
        </span>
      </div>
      {note && <p className="mt-3 text-sm leading-6 text-slate-600">{note}</p>}
    </article>
  )
}

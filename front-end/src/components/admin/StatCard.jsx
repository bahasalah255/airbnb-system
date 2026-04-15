export default function StatCard({ title, value, hint }) {
  return (
    <article className="dashboard-surface group p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_30px_-22px_rgba(15,23,42,0.65)]">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      {hint && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
    </article>
  )
}

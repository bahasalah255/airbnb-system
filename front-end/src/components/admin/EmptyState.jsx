export default function EmptyState({ title, description }) {
  return (
    <div className="dashboard-surface p-9 text-center">
      <p className="text-lg font-semibold tracking-tight text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
    </div>
  )
}

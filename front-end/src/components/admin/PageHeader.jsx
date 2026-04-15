export default function PageHeader({ title, description, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.7)] sm:p-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.7rem]">{title}</h1>
        {description && <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-600">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export default function ClientSectionCard({ title, description, children }) {
  return (
    <section className="rounded-[1.8rem] border border-white/80 bg-white/90 p-5 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.5)] sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">{title}</h2>
          {description && <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

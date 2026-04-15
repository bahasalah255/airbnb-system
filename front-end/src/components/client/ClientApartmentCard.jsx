import ApartmentImage from '../apartments/ApartmentImage.jsx'

export default function ClientApartmentCard({ apartment, children, footer }) {
  return (
    <article className="overflow-hidden rounded-[1.6rem] border border-slate-200/70 bg-white shadow-[0_18px_45px_-34px_rgba(15,23,42,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-34px_rgba(15,23,42,0.65)]">
      <div className="relative h-48 bg-slate-100">
        <ApartmentImage photos={apartment?.photos} alt={apartment?.name} className="h-full w-full" imageClassName="h-full w-full object-cover" />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-slate-900">{apartment?.name}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{apartment?.address}</p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-slate-900">{children}</p>
        </div>
        {footer && <div className="mt-4 flex flex-wrap gap-2">{footer}</div>}
      </div>
    </article>
  )
}

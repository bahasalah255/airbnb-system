import ApartmentImage from '../../apartments/ApartmentImage.jsx'
import { formatCurrency, formatDate } from '../../../utils/format.js'

function getCity(address) {
  if (!address) return 'Lieu non specifie'
  const parts = String(address).split(',').map((part) => part.trim()).filter(Boolean)
  return parts[parts.length - 1] || address
}

function getCategory(apartment) {
  return Number(apartment?.capacity ?? 1) >= 4 ? 'Espaces' : 'Appartements'
}

function getRating(apartment) {
  if (typeof apartment?.rating === 'number') return apartment.rating.toFixed(1)
  const seed = Number(apartment?.id ?? 1)
  return (4 + (seed % 9) / 10).toFixed(1)
}

export default function CardItem({ apartment, onSave, isSaved, onView }) {
  const category = getCategory(apartment)
  const city = getCity(apartment?.address)
  const rating = getRating(apartment)

  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_18px_45px_-34px_rgba(15,23,42,0.5)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_65px_-36px_rgba(15,23,42,0.55)]">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <ApartmentImage
          photos={apartment?.photos}
          alt={apartment?.name}
          className="h-full w-full"
          imageClassName="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
        />

        <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70">
          {category}
        </span>

        <span className="absolute bottom-3 left-3 rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {formatCurrency(apartment?.price_per_night)} / nuit
        </span>
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold tracking-tight text-slate-900">{apartment?.name}</h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
            <span aria-hidden>★</span>
            {rating}
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-slate-600">
          {apartment?.description || 'Un lieu accueillant pour votre prochain sejour.'}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>{city}</span>
          <span>{formatDate(apartment?.created_at) || 'Disponible'}</span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={() => onSave?.(apartment.id)}
            className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
              isSaved
                ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {isSaved ? 'Enregistre' : 'Enregistrer'}
          </button>

          <button
            type="button"
            onClick={() => onView?.(apartment.id)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Voir
          </button>
        </div>
      </div>
    </article>
  )
}

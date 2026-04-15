export default function Pagination({ meta, onPageChange }) {
  if (!meta) return null

  const current = meta.current_page ?? 1
  const last = meta.last_page ?? 1

  return (
    <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 shadow-sm">
      <p>
        Page {current} / {last}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(current - 1)}
          disabled={current <= 1}
          className="dashboard-ghost-btn disabled:cursor-not-allowed disabled:opacity-50"
        >
          Precedent
        </button>
        <button
          type="button"
          onClick={() => onPageChange(current + 1)}
          disabled={current >= last}
          className="dashboard-ghost-btn disabled:cursor-not-allowed disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  )
}

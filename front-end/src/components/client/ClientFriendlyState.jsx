export function ClientLoadingState({ label = 'Loading your space...' }) {
  return (
    <div className="rounded-[1.6rem] border border-white/80 bg-white/90 p-8 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.55)]">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-500" />
        <span>{label}</span>
      </div>
    </div>
  )
}

export function ClientErrorState({ message, onRetry }) {
  return (
    <div className="rounded-[1.6rem] border border-rose-200 bg-rose-50/80 p-6 shadow-[0_18px_40px_-32px_rgba(190,24,93,0.35)]">
      <p className="text-sm font-semibold text-rose-700">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
        >
          Try again
        </button>
      )}
    </div>
  )
}

export function ClientEmptyState({ title, description, action }) {
  return (
    <div className="rounded-[1.6rem] border border-dashed border-slate-200 bg-white/80 p-10 text-center shadow-[0_18px_40px_-34px_rgba(15,23,42,0.45)]">
      <p className="text-lg font-semibold tracking-tight text-slate-900">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

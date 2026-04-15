export default function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/85 p-5 shadow-[0_12px_30px_-24px_rgba(190,24,93,0.7)]">
      <p className="text-sm font-semibold text-rose-700">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-xl bg-rose-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
        >
          Reessayer
        </button>
      )}
    </div>
  )
}

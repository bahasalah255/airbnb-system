const confirmToneClass = {
  danger: 'bg-rose-600 hover:bg-rose-700',
  success: 'bg-emerald-600 hover:bg-emerald-700',
  primary: 'bg-slate-900 hover:bg-slate-800',
}

export default function ConfirmModal({
  open,
  title,
  description,
  onCancel,
  onConfirm,
  isLoading,
  confirmLabel = 'Supprimer',
  loadingLabel = 'Suppression...',
  confirmTone = 'danger',
}) {
  if (!open) return null

  const toneClass = confirmToneClass[confirmTone] ?? confirmToneClass.danger

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.8)]">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="dashboard-ghost-btn"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-xl px-3.5 py-2 text-sm font-semibold text-white transition disabled:opacity-70 ${toneClass}`}
          >
            {isLoading ? loadingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

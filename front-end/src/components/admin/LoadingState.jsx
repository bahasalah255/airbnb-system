export default function LoadingState({ label = 'Chargement des donnees...' }) {
  return (
    <div className="dashboard-surface grid min-h-[260px] place-items-center p-4">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500" />
        <span>{label}</span>
      </div>
    </div>
  )
}

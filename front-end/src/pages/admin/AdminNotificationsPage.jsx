import { useCallback, useEffect, useState } from 'react'
import { adminNotificationsApi } from '../../lib/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import PageHeader from '../../components/admin/PageHeader.jsx'
import LoadingState from '../../components/admin/LoadingState.jsx'
import ErrorState from '../../components/admin/ErrorState.jsx'
import EmptyState from '../../components/admin/EmptyState.jsx'
import { formatDateTime } from '../../utils/format.js'

export default function AdminNotificationsPage() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await adminNotificationsApi(token)
      setItems(response.items ?? [])
    } catch (err) {
      setError(err.message ?? 'Impossible de charger les notifications.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) return <LoadingState label="Chargement activite recente..." />
  if (error) return <ErrorState message={error} onRetry={loadData} />

  return (
    <div>
      <PageHeader
        title="Notifications & activite recente"
        description="Historique recent des evenements importants de la plateforme."
      />

      {items.length === 0 ? (
        <EmptyState title="Aucune notification" description="Aucune activite recente pour le moment." />
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={`${item.timestamp}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-medium text-slate-900">{item.title}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">{item.type}</p>
              <p className="mt-1 text-xs text-slate-500">{formatDateTime(item.timestamp)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

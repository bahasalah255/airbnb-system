import { useCallback, useEffect, useState } from 'react'
import { ownerNotificationsApi } from '../../lib/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import PageHeader from '../../components/admin/PageHeader.jsx'
import LoadingState from '../../components/admin/LoadingState.jsx'
import ErrorState from '../../components/admin/ErrorState.jsx'
import EmptyState from '../../components/admin/EmptyState.jsx'
import StatusBadge from '../../components/admin/StatusBadge.jsx'
import { formatDateTime } from '../../utils/format.js'

export default function OwnerNotificationsPage() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await ownerNotificationsApi(token)
      setItems(response.items ?? [])
    } catch (err) {
      setError(err.message ?? 'Unable to load notifications.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) return <LoadingState label="Loading notifications..." />
  if (error) return <ErrorState message={error} onRetry={loadData} />

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay up to date with new bookings and cancellations."
      />

      {items.length === 0 ? (
        <EmptyState title="No notifications" description="No recent updates for now." />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-medium text-slate-900">{item.title}</p>
              <div className="mt-2 flex items-center justify-between">
                <StatusBadge label={item.status} />
                <p className="text-xs text-slate-500">{formatDateTime(item.created_at)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

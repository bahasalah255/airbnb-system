import { useCallback, useEffect, useState } from 'react'
import { ownerOverviewApi } from '../../lib/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import PageHeader from '../../components/admin/PageHeader.jsx'
import StatCard from '../../components/admin/StatCard.jsx'
import AdminTable from '../../components/admin/AdminTable.jsx'
import LoadingState from '../../components/admin/LoadingState.jsx'
import ErrorState from '../../components/admin/ErrorState.jsx'
import StatusBadge from '../../components/admin/StatusBadge.jsx'
import { formatCurrency, formatDate } from '../../utils/format.js'

export default function OwnerOverviewPage() {
  const { token } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await ownerOverviewApi(token)
      setData(response)
    } catch (err) {
      setError(err.message ?? 'Unable to load owner dashboard overview.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) return <LoadingState label="Loading owner dashboard..." />
  if (error) return <ErrorState message={error} onRetry={loadData} />

  const metrics = data?.metrics ?? {}

  return (
    <div className="space-y-6">
      <PageHeader
        title="Owner Dashboard"
        description="Track properties, bookings and performance in real time."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Total apartments" value={metrics.total_apartments} />
        <StatCard title="Total reservations" value={metrics.total_reservations} />
        <StatCard title="Pending reservations" value={metrics.pending_reservations} />
        <StatCard title="Confirmed reservations" value={metrics.confirmed_reservations} />
        <StatCard title="Monthly revenue" value={formatCurrency(metrics.monthly_revenue)} />
        <StatCard title="Occupancy rate" value={`${metrics.occupancy_rate}%`} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Recent reservations</h2>
          <div className="mt-4">
            <AdminTable headers={['Client', 'Apartment', 'Dates', 'Total', 'Status']}>
              {(data?.recent_reservations ?? []).map((reservation) => (
                <tr key={reservation.id}>
                  <td className="px-4 py-3 text-sm text-slate-700">{reservation.client?.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{reservation.apartment?.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {formatDate(reservation.check_in)} - {formatDate(reservation.check_out)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{formatCurrency(reservation.total_price)}</td>
                  <td className="px-4 py-3"><StatusBadge label={reservation.status} /></td>
                </tr>
              ))}
            </AdminTable>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Notifications</h2>
          <ul className="mt-4 space-y-3">
            {(data?.notifications ?? []).map((item) => (
              <li key={item.id} className="rounded-xl border border-slate-200 px-3 py-2">
                <p className="text-sm font-medium text-slate-900">{item.title}</p>
                <div className="mt-2 flex items-center justify-between">
                  <StatusBadge label={item.status} />
                  <p className="text-xs text-slate-500">{formatDate(item.created_at)}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}

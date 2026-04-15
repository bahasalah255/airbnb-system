import { useCallback, useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { adminOverviewApi } from '../../lib/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import PageHeader from '../../components/admin/PageHeader.jsx'
import StatCard from '../../components/admin/StatCard.jsx'
import AdminTable from '../../components/admin/AdminTable.jsx'
import LoadingState from '../../components/admin/LoadingState.jsx'
import ErrorState from '../../components/admin/ErrorState.jsx'
import StatusBadge from '../../components/admin/StatusBadge.jsx'
import { formatCurrency, formatDate } from '../../utils/format.js'

const pieColors = ['#f59e0b', '#10b981', '#ef4444']

export default function AdminOverviewPage() {
  const { token } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await adminOverviewApi(token)
      setData(response)
    } catch (err) {
      setError(err.message ?? 'Impossible de charger le dashboard overview.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) return <LoadingState label="Chargement du dashboard..." />
  if (error) return <ErrorState message={error} onRetry={loadData} />

  const metrics = data?.metrics ?? {}
  const statusData = [
    { name: 'Pending', value: data?.status_breakdown?.pending ?? 0 },
    { name: 'Confirmed', value: data?.status_breakdown?.confirmed ?? 0 },
    { name: 'Cancelled', value: data?.status_breakdown?.cancelled ?? 0 },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Overview"
        description="Vision globale de la plateforme, indicateurs business et activite recente."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total utilisateurs" value={metrics.total_users} />
        <StatCard title="Proprietaires" value={metrics.total_owners} />
        <StatCard title="Clients" value={metrics.total_clients} />
        <StatCard title="Appartements" value={metrics.total_apartments} />
        <StatCard title="Reservations" value={metrics.total_reservations} />
        <StatCard title="En attente" value={metrics.pending_reservations} />
        <StatCard title="Confirmees" value={metrics.confirmed_reservations} />
        <StatCard title="Revenus" value={formatCurrency(metrics.total_revenue)} />
        <StatCard title="Occupation" value={`${metrics.occupancy_rate}%`} />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-1">
          <h2 className="text-sm font-semibold text-slate-900">Repartition des statuts</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={52}>
                  {statusData.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2">
          <h2 className="text-sm font-semibold text-slate-900">Dernieres reservations</h2>
          <div className="mt-4">
            <AdminTable headers={['Client', 'Appartement', 'Dates', 'Total', 'Statut']}>
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
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Appartements les plus reserves</h2>
          <div className="mt-4 space-y-3">
            {(data?.top_apartments ?? []).map((apartment) => (
              <div key={apartment.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-slate-900">{apartment.name}</p>
                  <p className="text-xs text-slate-500">{apartment.reservations_count} reservations</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">{formatCurrency(apartment.revenue)}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Activite recente</h2>
          <ul className="mt-4 space-y-3">
            {(data?.recent_activity ?? []).map((item, index) => (
              <li key={`${item.timestamp}-${index}`} className="rounded-xl border border-slate-200 px-3 py-2">
                <p className="text-sm text-slate-800">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500">{formatDate(item.timestamp)}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from 'recharts'
import { adminAnalyticsApi } from '../../lib/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import PageHeader from '../../components/admin/PageHeader.jsx'
import LoadingState from '../../components/admin/LoadingState.jsx'
import ErrorState from '../../components/admin/ErrorState.jsx'

export default function AdminAnalyticsPage() {
  const { token } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await adminAnalyticsApi(token)
      setData(response)
    } catch (err) {
      setError(err.message ?? 'Impossible de charger les analytics.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) return <LoadingState label="Chargement analytics..." />
  if (error) return <ErrorState message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Statistiques & Analytics"
        description="Suivi mensuel des reservations, revenus, inscriptions et occupation moyenne."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-900">Reservations par mois</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.reservations_per_month ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#0f172a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-900">Revenus par mois</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.revenue_per_month ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-900">Inscriptions utilisateurs</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.users_per_month ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#16a34a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-900">Top appartements</h2>
          <ul className="mt-4 space-y-3">
            {(data?.top_apartments ?? []).map((apartment) => (
              <li key={apartment.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2">
                <p className="text-sm font-medium text-slate-900">{apartment.name}</p>
                <p className="text-sm text-slate-600">{apartment.reservations_count} reservations</p>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            Taux d'occupation moyen: <span className="font-semibold">{data?.average_occupancy}%</span>
          </div>
        </article>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-900">Repartition des roles et statuts</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Roles</p>
            <ul className="mt-3 space-y-2">
              {(data?.roles_distribution ?? []).map((item) => (
                <li key={item.role} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{item.role}</span>
                  <span className="font-semibold">{item.total}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Statuts reservations</p>
            <ul className="mt-3 space-y-2">
              {(data?.reservation_status_distribution ?? []).map((item) => (
                <li key={item.status} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{item.status}</span>
                  <span className="font-semibold">{item.total}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Legend />
      </article>
    </div>
  )
}

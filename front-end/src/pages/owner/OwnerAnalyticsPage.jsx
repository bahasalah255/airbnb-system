import { useCallback, useEffect, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from 'recharts'
import { ownerAnalyticsApi } from '../../lib/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import PageHeader from '../../components/admin/PageHeader.jsx'
import LoadingState from '../../components/admin/LoadingState.jsx'
import ErrorState from '../../components/admin/ErrorState.jsx'

export default function OwnerAnalyticsPage() {
  const { token } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await ownerAnalyticsApi(token)
      setData(response)
    } catch (err) {
      setError(err.message ?? 'Unable to load analytics.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) return <LoadingState label="Loading analytics..." />
  if (error) return <ErrorState message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue & Analytics"
        description="Track monthly trends and optimize your rental performance."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-900">Revenue per month</h2>
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

        <article className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-900">Reservations per month</h2>
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
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Occupancy rate</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{data?.occupancy_rate}%</p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 xl:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Most booked apartment</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-lg font-semibold text-slate-900">{data?.most_booked_apartment?.name ?? 'N/A'}</p>
            <p className="text-sm text-slate-600">
              {data?.most_booked_apartment?.reservations_count ?? 0} reservations
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}

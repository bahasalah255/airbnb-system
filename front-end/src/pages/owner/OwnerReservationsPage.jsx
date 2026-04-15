import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ownerReservationDetailsApi,
  ownerReservationsApi,
  ownerUpdateReservationStatusApi,
} from '../../lib/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import PageHeader from '../../components/admin/PageHeader.jsx'
import AdminFilters from '../../components/admin/AdminFilters.jsx'
import AdminTable from '../../components/admin/AdminTable.jsx'
import LoadingState from '../../components/admin/LoadingState.jsx'
import ErrorState from '../../components/admin/ErrorState.jsx'
import EmptyState from '../../components/admin/EmptyState.jsx'
import StatusBadge from '../../components/admin/StatusBadge.jsx'
import ConfirmModal from '../../components/admin/ConfirmModal.jsx'
import Pagination from '../../components/admin/Pagination.jsx'
import useDebouncedValue from '../../hooks/useDebouncedValue.js'
import { formatCurrency, formatDate } from '../../utils/format.js'

export default function OwnerReservationsPage() {
  const { token } = useAuth()
  const [filters, setFilters] = useState({ search: '', status: '', page: 1 })
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionState, setActionState] = useState(null)
  const [details, setDetails] = useState(null)

  const debouncedSearch = useDebouncedValue(filters.search, 300)

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      status: filters.status,
      page: filters.page,
    }),
    [debouncedSearch, filters.page, filters.status],
  )

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await ownerReservationsApi(token, queryParams)
      setData(response)
    } catch (err) {
      setError(err.message ?? 'Unable to load reservations.')
    } finally {
      setLoading(false)
    }
  }, [queryParams, token])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function openDetails(reservationId) {
    const response = await ownerReservationDetailsApi(token, reservationId)
    setDetails(response.reservation)
  }

  async function updateStatus(reservationId, status) {
    await ownerUpdateReservationStatusApi(token, reservationId, status)
    setActionState(null)
    await loadData()
  }

  if (loading && !data) return <LoadingState label="Loading reservations..." />
  if (error) return <ErrorState message={error} onRetry={loadData} />

  const reservations = data?.data ?? []

  return (
    <div>
      <PageHeader
        title="Reservations Management"
        description="Accept, reject and review booking requests for your listings."
      />

      {loading && data && <p className="mb-3 text-xs text-slate-500">Refreshing reservations...</p>}

      <AdminFilters>
        <input
          type="text"
          value={filters.search}
          onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value, page: 1 }))}
          placeholder="Search client or apartment"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={filters.status}
          onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value, page: 1 }))}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </AdminFilters>

      {reservations.length === 0 ? (
        <EmptyState title="No reservations" description="No booking matches your current filters." />
      ) : (
        <>
          <AdminTable headers={['Client', 'Apartment', 'Dates', 'Total', 'Status', 'Actions']}>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td className="px-4 py-3 text-sm text-slate-700">{reservation.client?.name}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{reservation.apartment?.name}</td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {formatDate(reservation.check_in)} - {formatDate(reservation.check_out)}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{formatCurrency(reservation.total_price)}</td>
                <td className="px-4 py-3"><StatusBadge label={reservation.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setActionState({ reservation, action: 'confirmed' })}
                      className="rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => setActionState({ reservation, action: 'cancelled' })}
                      className="rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => openDetails(reservation.id)}
                      className="dashboard-ghost-btn !px-2.5 !py-1"
                    >
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
          <Pagination meta={data} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />
        </>
      )}

      <ConfirmModal
        open={Boolean(actionState)}
        title={actionState?.action === 'confirmed' ? 'Accept this reservation?' : 'Reject this reservation?'}
        description={actionState ? `Reservation #${actionState.reservation.id}` : ''}
        onCancel={() => setActionState(null)}
        onConfirm={() => updateStatus(actionState.reservation.id, actionState.action)}
        confirmLabel={actionState?.action === 'confirmed' ? 'Accept' : 'Reject'}
        loadingLabel={actionState?.action === 'confirmed' ? 'Accepting...' : 'Rejecting...'}
        confirmTone={actionState?.action === 'confirmed' ? 'success' : 'danger'}
      />

      {details && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.8)]">
            <h3 className="text-lg font-semibold tracking-tight text-slate-900">Reservation details</h3>
            <div className="mt-4 grid gap-2 text-sm text-slate-700">
              <p>
                <span className="font-semibold">Client:</span> {details.client?.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {details.client?.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {details.client?.phone ?? '-'}
              </p>
              <p>
                <span className="font-semibold">Apartment:</span> {details.apartment?.name}
              </p>
              <p>
                <span className="font-semibold">Dates:</span> {formatDate(details.check_in)} - {formatDate(details.check_out)}
              </p>
              <p>
                <span className="font-semibold">Total:</span> {formatCurrency(details.total_price)}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {details.status}
              </p>
              <p>
                <span className="font-semibold">Special requests:</span> {details.special_requests ?? '-'}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setDetails(null)}
                className="dashboard-primary-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

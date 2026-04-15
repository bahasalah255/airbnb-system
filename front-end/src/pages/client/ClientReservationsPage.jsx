import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  clientCancelReservationApi,
  clientReservationDetailsApi,
  clientReservationsApi,
} from '../../lib/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import ConfirmModal from '../../components/admin/ConfirmModal.jsx'
import Pagination from '../../components/admin/Pagination.jsx'
import useDebouncedValue from '../../hooks/useDebouncedValue.js'
import { formatCurrency, formatDate } from '../../utils/format.js'
import ClientSectionHeader from '../../components/client/ClientSectionHeader.jsx'
import ClientSectionCard from '../../components/client/ClientSectionCard.jsx'
import ClientReservationCard from '../../components/client/ClientReservationCard.jsx'
import { ClientLoadingState, ClientErrorState, ClientEmptyState } from '../../components/client/ClientFriendlyState.jsx'
import ClientStatusPill from '../../components/client/ClientStatusPill.jsx'

export default function ClientReservationsPage() {
  const { token } = useAuth()
  const [filters, setFilters] = useState({ search: '', filter: '', page: 1 })
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelState, setCancelState] = useState(null)
  const [details, setDetails] = useState(null)

  const debouncedSearch = useDebouncedValue(filters.search, 300)

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      filter: filters.filter,
      page: filters.page,
    }),
    [debouncedSearch, filters.filter, filters.page],
  )

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await clientReservationsApi(token, queryParams)
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
    const response = await clientReservationDetailsApi(token, reservationId)
    setDetails(response.reservation)
  }

  async function cancelReservation() {
    if (!cancelState) return
    await clientCancelReservationApi(token, cancelState.id)
    setCancelState(null)
    await loadData()
  }

  if (loading && !data) return <ClientLoadingState label="Loading your reservations..." />
  if (error) return <ClientErrorState message={error} onRetry={loadData} />

  const reservations = data?.data ?? []
  const filterTabs = [
    { key: '', label: 'All' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ]

  return (
    <div className="space-y-6">
      <ClientSectionHeader
        eyebrow="Your stays"
        title="Reservations"
        description="Browse your bookings like a timeline of trips, with clear images and simple actions."
      />

      <ClientSectionCard title="Find a reservation" description="Use search and quick tabs to find your stay faster.">
        <div className="space-y-3">
          <input
            type="text"
            value={filters.search}
            onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value, page: 1 }))}
            placeholder="Search by apartment or date"
            className="dashboard-input"
          />
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.key || 'all'}
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, filter: tab.key, page: 1 }))}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filters.filter === tab.key
                    ? 'bg-slate-900 text-white shadow-[0_10px_24px_-16px_rgba(15,23,42,0.7)]'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </ClientSectionCard>

      {reservations.length === 0 ? (
        <ClientEmptyState
          title="No reservations yet"
          description="Nothing matches your current filters. Try another search or explore more apartments."
        />
      ) : (
        <div className="space-y-4">
          {loading && data && <p className="text-xs text-slate-500">Refreshing reservations...</p>}
          {reservations.map((reservation) => (
            <ClientReservationCard
              key={reservation.id}
              reservation={reservation}
              onDetails={() => openDetails(reservation.id)}
              onCancel={() => setCancelState(reservation)}
            />
          ))}
          <Pagination meta={data} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />
        </div>
      )}

      <ConfirmModal
        open={Boolean(cancelState)}
        title="Cancel this reservation?"
        description={cancelState ? `Reservation #${cancelState.id}` : ''}
        onCancel={() => setCancelState(null)}
        onConfirm={cancelReservation}
        confirmLabel="Cancel reservation"
        loadingLabel="Cancelling..."
        confirmTone="danger"
      />

      {details && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.55)] sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-amber-700">Reservation details</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{details.apartment?.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{details.apartment?.address}</p>
              </div>
              <ClientStatusPill label={details.status} />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.3rem] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Check-in</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{formatDate(details.check_in)}</p>
              </div>
              <div className="rounded-[1.3rem] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Check-out</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{formatDate(details.check_out)}</p>
              </div>
              <div className="rounded-[1.3rem] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Total</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{formatCurrency(details.total_price)}</p>
              </div>
            </div>

            <div className="mt-6 rounded-[1.3rem] bg-amber-50/80 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Notes</p>
              <p className="mt-1 leading-6">Special requests: {details.special_requests ?? '-'}</p>
            </div>

            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setDetails(null)} className="dashboard-primary-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

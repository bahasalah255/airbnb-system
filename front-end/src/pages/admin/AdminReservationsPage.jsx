import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  adminDeleteReservationApi,
  adminReservationsApi,
  adminUpdateReservationStatusApi,
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
import { formatCurrency, formatDate } from '../../utils/format.js'
import useDebouncedValue from '../../hooks/useDebouncedValue.js'

export default function AdminReservationsPage() {
  const { token } = useAuth()
  const [filters, setFilters] = useState({ search: '', status: '', page: 1 })
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteItem, setDeleteItem] = useState(null)
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
      const response = await adminReservationsApi(token, queryParams)
      setData(response)
    } catch (err) {
      setError(err.message ?? 'Impossible de charger les reservations.')
    } finally {
      setLoading(false)
    }
  }, [queryParams, token])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleStatusChange(id, status) {
    await adminUpdateReservationStatusApi(token, id, status)
    await loadData()
  }

  async function handleDelete() {
    if (!deleteItem) return
    await adminDeleteReservationApi(token, deleteItem.id)
    setDeleteItem(null)
    await loadData()
  }

  if (loading && !data) return <LoadingState label="Chargement des reservations..." />
  if (error) return <ErrorState message={error} onRetry={loadData} />

  const reservations = data?.data ?? []

  return (
    <div>
      <PageHeader title="Gestion des reservations" description="Suivi complet des statuts et actions rapides de traitement." />

      {loading && data && <p className="mb-3 text-xs text-slate-500">Mise a jour des resultats...</p>}

      <AdminFilters>
        <input
          type="text"
          value={filters.search}
          onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value, page: 1 }))}
          placeholder="Recherche client ou appartement"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={filters.status}
          onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value, page: 1 }))}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Tous statuts</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </AdminFilters>

      {reservations.length === 0 ? (
        <EmptyState title="Aucune reservation" description="Ajustez les filtres pour afficher des resultats." />
      ) : (
        <>
          <AdminTable headers={['Client', 'Appartement', 'Dates', 'Total', 'Statut', 'Creation', 'Actions']}>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td className="px-4 py-3 text-sm text-slate-700">{reservation.client?.name}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{reservation.apartment?.name}</td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {formatDate(reservation.check_in)} - {formatDate(reservation.check_out)}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{formatCurrency(reservation.total_price)}</td>
                <td className="px-4 py-3"><StatusBadge label={reservation.status} /></td>
                <td className="px-4 py-3 text-sm text-slate-700">{formatDate(reservation.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                      className="rounded-lg border border-emerald-300 px-2 py-1 text-xs text-emerald-700"
                    >
                      Confirmer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                      className="rounded-lg border border-amber-300 px-2 py-1 text-xs text-amber-700"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteItem(reservation)}
                      className="rounded-lg bg-rose-600 px-2 py-1 text-xs text-white"
                    >
                      Supprimer
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
        open={Boolean(deleteItem)}
        title="Supprimer cette reservation ?"
        description={deleteItem ? `Reservation #${deleteItem.id}` : ''}
        onCancel={() => setDeleteItem(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}

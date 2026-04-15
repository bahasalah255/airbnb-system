import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminOwnersApi } from '../../lib/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import PageHeader from '../../components/admin/PageHeader.jsx'
import AdminFilters from '../../components/admin/AdminFilters.jsx'
import AdminTable from '../../components/admin/AdminTable.jsx'
import LoadingState from '../../components/admin/LoadingState.jsx'
import ErrorState from '../../components/admin/ErrorState.jsx'
import EmptyState from '../../components/admin/EmptyState.jsx'
import Pagination from '../../components/admin/Pagination.jsx'
import StatusBadge from '../../components/admin/StatusBadge.jsx'
import { formatCurrency, formatDate } from '../../utils/format.js'
import useDebouncedValue from '../../hooks/useDebouncedValue.js'

export default function AdminOwnersPage() {
  const { token } = useAuth()
  const [filters, setFilters] = useState({ search: '', page: 1 })
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const debouncedSearch = useDebouncedValue(filters.search, 300)
  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      page: filters.page,
    }),
    [debouncedSearch, filters.page],
  )

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await adminOwnersApi(token, queryParams)
      setData(response)
    } catch (err) {
      setError(err.message ?? 'Impossible de charger les proprietaires.')
    } finally {
      setLoading(false)
    }
  }, [queryParams, token])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading && !data) return <LoadingState label="Chargement des proprietaires..." />
  if (error) return <ErrorState message={error} onRetry={loadData} />

  const owners = data?.data ?? []

  return (
    <div>
      <PageHeader
        title="Gestion des proprietaires"
        description="Performance business des proprietaires: parc, reservations et revenus."
      />

      {loading && data && <p className="mb-3 text-xs text-slate-500">Mise a jour des resultats...</p>}

      <AdminFilters>
        <input
          type="text"
          value={filters.search}
          onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value, page: 1 }))}
          placeholder="Recherche nom ou email"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        />
      </AdminFilters>

      {owners.length === 0 ? (
        <EmptyState title="Aucun proprietaire" description="Aucun compte proprietaire ne correspond aux filtres." />
      ) : (
        <>
          <AdminTable headers={['Nom', 'Email', 'Statut', 'Appartements', 'Reservations', 'Revenus', 'Inscription']}>
            {owners.map((owner) => (
              <tr key={owner.id}>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{owner.name}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{owner.email}</td>
                <td className="px-4 py-3"><StatusBadge label={owner.is_active ? 'active' : 'inactive'} /></td>
                <td className="px-4 py-3 text-sm text-slate-700">{owner.apartments_count}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{owner.reservations_count}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{formatCurrency(owner.revenue)}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{formatDate(owner.created_at)}</td>
              </tr>
            ))}
          </AdminTable>
          <Pagination meta={data} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />
        </>
      )}
    </div>
  )
}

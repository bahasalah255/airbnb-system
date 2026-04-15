import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  adminDeleteUserApi,
  adminUpdateUserRoleApi,
  adminUpdateUserStatusApi,
  adminUsersApi,
} from '../../lib/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import PageHeader from '../../components/admin/PageHeader.jsx'
import AdminFilters from '../../components/admin/AdminFilters.jsx'
import AdminTable from '../../components/admin/AdminTable.jsx'
import LoadingState from '../../components/admin/LoadingState.jsx'
import ErrorState from '../../components/admin/ErrorState.jsx'
import EmptyState from '../../components/admin/EmptyState.jsx'
import StatusBadge from '../../components/admin/StatusBadge.jsx'
import Pagination from '../../components/admin/Pagination.jsx'
import ConfirmModal from '../../components/admin/ConfirmModal.jsx'
import { formatDate } from '../../utils/format.js'
import useDebouncedValue from '../../hooks/useDebouncedValue.js'

const initialFilters = {
  search: '',
  role: '',
  status: '',
  page: 1,
}

export default function AdminUsersPage() {
  const { token } = useAuth()
  const [filters, setFilters] = useState(initialFilters)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [deleteUser, setDeleteUser] = useState(null)
  const debouncedSearch = useDebouncedValue(filters.search, 300)
  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      role: filters.role,
      status: filters.status,
      page: filters.page,
    }),
    [debouncedSearch, filters.page, filters.role, filters.status],
  )

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await adminUsersApi(token, queryParams)
      setData(response)
    } catch (err) {
      setError(err.message ?? 'Impossible de charger les utilisateurs.')
    } finally {
      setLoading(false)
    }
  }, [queryParams, token])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleRoleChange(userId, role) {
    setActionLoadingId(userId)
    try {
      await adminUpdateUserRoleApi(token, userId, role)
      await loadData()
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handleStatusToggle(userId, isActive) {
    setActionLoadingId(userId)
    try {
      await adminUpdateUserStatusApi(token, userId, !isActive)
      await loadData()
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handleDeleteUser() {
    if (!deleteUser) return

    setActionLoadingId(deleteUser.id)
    try {
      await adminDeleteUserApi(token, deleteUser.id)
      setDeleteUser(null)
      await loadData()
    } finally {
      setActionLoadingId(null)
    }
  }

  if (loading && !data) return <LoadingState label="Chargement des utilisateurs..." />
  if (error) return <ErrorState message={error} onRetry={loadData} />

  const users = data?.data ?? []

  return (
    <div>
      <PageHeader title="Gestion des utilisateurs" description="Recherche, filtrage, roles, activation et suppression." />

      {loading && data && <p className="mb-3 text-xs text-slate-500">Mise a jour des resultats...</p>}

      <AdminFilters>
        <input
          type="text"
          placeholder="Recherche nom ou email"
          value={filters.search}
          onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value, page: 1 }))}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <select
          value={filters.role}
          onChange={(event) => setFilters((prev) => ({ ...prev, role: event.target.value, page: 1 }))}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="">Tous les roles</option>
          <option value="admin">Admin</option>
          <option value="owner">Proprietaire</option>
          <option value="client">Client</option>
        </select>
        <select
          value={filters.status}
          onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value, page: 1 }))}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
      </AdminFilters>

      {users.length === 0 ? (
        <EmptyState title="Aucun utilisateur" description="Ajustez les filtres ou creez de nouveaux comptes." />
      ) : (
        <>
          <AdminTable headers={['Nom', 'Email', 'Role', 'Statut', 'Inscription', 'Actions']}>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{user.name}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{user.email}</td>
                <td className="px-4 py-3">
                  <StatusBadge label={user.role} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge label={user.is_active ? 'active' : 'inactive'} />
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">{formatDate(user.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={user.role}
                      onChange={(event) => handleRoleChange(user.id, event.target.value)}
                      disabled={actionLoadingId === user.id}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                    >
                      <option value="admin">Admin</option>
                      <option value="owner">Proprietaire</option>
                      <option value="client">Client</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(user.id, user.is_active)}
                      disabled={actionLoadingId === user.id}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                    >
                      {user.is_active ? 'Desactiver' : 'Activer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteUser(user)}
                      disabled={actionLoadingId === user.id}
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
        open={Boolean(deleteUser)}
        title="Supprimer cet utilisateur ?"
        description={deleteUser ? `Compte: ${deleteUser.name} (${deleteUser.email})` : ''}
        onCancel={() => setDeleteUser(null)}
        onConfirm={handleDeleteUser}
        isLoading={Boolean(deleteUser && actionLoadingId === deleteUser.id)}
      />
    </div>
  )
}

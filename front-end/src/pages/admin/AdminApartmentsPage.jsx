import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  adminApartmentsApi,
  adminCreateApartmentApi,
  adminDeleteApartmentApi,
  adminUpdateApartmentApi,
  adminUpdateApartmentStatusApi,
  adminUsersApi,
} from '../../lib/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import PageHeader from '../../components/admin/PageHeader.jsx'
import AdminFilters from '../../components/admin/AdminFilters.jsx'
import AdminTable from '../../components/admin/AdminTable.jsx'
import LoadingState from '../../components/admin/LoadingState.jsx'
import ErrorState from '../../components/admin/ErrorState.jsx'
import EmptyState from '../../components/admin/EmptyState.jsx'
import Pagination from '../../components/admin/Pagination.jsx'
import ConfirmModal from '../../components/admin/ConfirmModal.jsx'
import StatusBadge from '../../components/admin/StatusBadge.jsx'
import { formatCurrency } from '../../utils/format.js'
import useDebouncedValue from '../../hooks/useDebouncedValue.js'
import ApartmentImage from '../../components/apartments/ApartmentImage.jsx'
import ApartmentImageUpload from '../../components/apartments/ApartmentImageUpload.jsx'
import { getApartmentGallery } from '../../utils/apartmentImages.js'

const initialForm = {
  owner_id: '',
  name: '',
  address: '',
  price_per_night: '',
  description: '',
  capacity: 1,
  is_active: true,
}

export default function AdminApartmentsPage() {
  const { token } = useAuth()
  const [filters, setFilters] = useState({ search: '', status: '', owner_id: '', page: 1 })
  const [data, setData] = useState(null)
  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteItem, setDeleteItem] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [existingPhotos, setExistingPhotos] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])
  const [viewMode, setViewMode] = useState('table')
  const debouncedSearch = useDebouncedValue(filters.search, 300)
  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      status: filters.status,
      owner_id: filters.owner_id,
      page: filters.page,
    }),
    [debouncedSearch, filters.owner_id, filters.page, filters.status],
  )

  const showForm = useMemo(() => Boolean(editing) || submitting, [editing, submitting])

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [apartmentsRes, ownersRes] = await Promise.all([
        adminApartmentsApi(token, queryParams),
        adminUsersApi(token, { role: 'owner', per_page: 100 }),
      ])

      setData(apartmentsRes)
      setOwners(ownersRes.data ?? [])
    } catch (err) {
      setError(err.message ?? 'Impossible de charger les appartements.')
    } finally {
      setLoading(false)
    }
  }, [queryParams, token])

  useEffect(() => {
    loadData()
  }, [loadData])

  function openCreateForm() {
    setEditing({ id: null })
    setForm(initialForm)
    setExistingPhotos([])
    setSelectedFiles([])
  }

  function openEditForm(apartment) {
    setEditing(apartment)
    setForm({
      owner_id: apartment.owner_id,
      name: apartment.name,
      address: apartment.address,
      price_per_night: apartment.price_per_night,
      description: apartment.description,
      capacity: apartment.capacity,
      is_active: apartment.is_active,
    })
    setExistingPhotos(Array.isArray(apartment.photos) ? apartment.photos : [])
    setSelectedFiles([])
  }

  async function handleSave(event) {
    event.preventDefault()
    setSubmitting(true)

    const payload = new FormData()
    payload.append('owner_id', String(form.owner_id))
    payload.append('name', form.name)
    payload.append('address', form.address)
    payload.append('price_per_night', String(form.price_per_night))
    payload.append('description', form.description)
    payload.append('capacity', String(form.capacity))
    payload.append('is_active', form.is_active ? '1' : '0')

    existingPhotos.forEach((photo) => payload.append('kept_photos[]', photo))
    selectedFiles.forEach((file) => payload.append('photos[]', file))

    try {
      if (editing?.id) {
        await adminUpdateApartmentApi(token, editing.id, payload)
      } else {
        await adminCreateApartmentApi(token, payload)
      }

      setEditing(null)
      setForm(initialForm)
      await loadData()
    } finally {
      setSubmitting(false)
    }
  }

  async function handleStatusToggle(apartment) {
    await adminUpdateApartmentStatusApi(token, apartment.id, !apartment.is_active)
    await loadData()
  }

  async function handleDeleteApartment() {
    if (!deleteItem) return
    await adminDeleteApartmentApi(token, deleteItem.id)
    setDeleteItem(null)
    await loadData()
  }

  if (loading && !data) return <LoadingState label="Chargement des appartements..." />
  if (error) return <ErrorState message={error} onRetry={loadData} />

  const apartments = data?.data ?? []

  return (
    <div className="space-y-4">
      <PageHeader
        title="Gestion des appartements"
        description="Catalogue complet avec filtres, edition, activation et suppression."
        actions={
          <>
            <button
              type="button"
              onClick={() => setViewMode((prev) => (prev === 'table' ? 'cards' : 'table'))}
              className="dashboard-ghost-btn"
            >
              {viewMode === 'table' ? 'Card view' : 'Table view'}
            </button>
            <button
              type="button"
              onClick={openCreateForm}
              className="dashboard-primary-btn"
            >
              Ajouter appartement
            </button>
          </>
        }
      />

      {loading && data && <p className="mb-3 text-xs text-slate-500">Mise a jour des resultats...</p>}

      <AdminFilters>
        <input
          type="text"
          value={filters.search}
          placeholder="Recherche"
          onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value, page: 1 }))}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={filters.status}
          onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value, page: 1 }))}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Tous statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
        <select
          value={filters.owner_id}
          onChange={(event) => setFilters((prev) => ({ ...prev, owner_id: event.target.value, page: 1 }))}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Tous proprietaires</option>
          {owners.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.name}
            </option>
          ))}
        </select>
      </AdminFilters>

      {editing && (
        <form onSubmit={handleSave} className="dashboard-surface space-y-5 p-5">
          <div className="grid gap-3 md:grid-cols-2">
            <select
              required
              value={form.owner_id}
              onChange={(event) => setForm((prev) => ({ ...prev, owner_id: event.target.value }))}
              className="dashboard-select"
            >
              <option value="">Selectionner proprietaire</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name}
                </option>
              ))}
            </select>
            <input
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Nom appartement"
              className="dashboard-input"
            />
            <input
              required
              value={form.address}
              onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
              placeholder="Adresse"
              className="dashboard-input md:col-span-2"
            />
            <input
              required
              type="number"
              min="0"
              value={form.price_per_night}
              onChange={(event) => setForm((prev) => ({ ...prev, price_per_night: event.target.value }))}
              placeholder="Prix/nuit"
              className="dashboard-input"
            />
            <input
              required
              type="number"
              min="1"
              value={form.capacity}
              onChange={(event) => setForm((prev) => ({ ...prev, capacity: event.target.value }))}
              placeholder="Capacite"
              className="dashboard-input"
            />
            <textarea
              required
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Description"
              className="dashboard-textarea md:col-span-2"
              rows={3}
            />
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) => setForm((prev) => ({ ...prev, is_active: event.target.checked }))}
              />
              Appartement actif
            </label>
          </div>

          <ApartmentImageUpload
            existingPhotos={existingPhotos}
            selectedFiles={selectedFiles}
            onExistingPhotosChange={setExistingPhotos}
            onSelectedFilesChange={setSelectedFiles}
            maxFiles={5}
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="dashboard-ghost-btn"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="dashboard-primary-btn"
            >
              {submitting ? 'Enregistrement...' : editing?.id ? 'Mettre a jour' : 'Creer'}
            </button>
          </div>
        </form>
      )}

      {apartments.length === 0 ? (
        <EmptyState title="Aucun appartement" description="Ajoutez un bien pour commencer." />
      ) : viewMode === 'cards' ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {apartments.map((apartment) => {
            const gallery = getApartmentGallery(apartment.photos)

            return (
              <article key={apartment.id} className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_16px_40px_-32px_rgba(15,23,42,0.5)]">
                <div className="grid gap-0">
                  <ApartmentImage
                    photos={apartment.photos}
                    alt={apartment.name}
                    className="h-48 w-full"
                    imageClassName="h-48 w-full object-cover"
                  />
                  <div className="grid grid-cols-3 gap-2 border-t border-slate-100 p-3">
                    {gallery.slice(0, 3).map((photo, index) => (
                      <ApartmentImage
                        key={`${apartment.id}-${index}`}
                        photos={[photo]}
                        alt={`${apartment.name} ${index + 1}`}
                        className="h-16 w-full"
                        imageClassName="h-16 w-full rounded-xl object-cover"
                      />
                    ))}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{apartment.name}</h3>
                      <p className="mt-1 text-xs text-slate-500">{apartment.address}</p>
                    </div>
                    <StatusBadge label={apartment.is_active ? 'active' : 'inactive'} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-900">{formatCurrency(apartment.price_per_night)}</span>
                    <span className="text-slate-500">Capacity {apartment.capacity}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" onClick={() => openEditForm(apartment)} className="dashboard-ghost-btn !px-3 !py-1.5">
                      Editer
                    </button>
                    <button type="button" onClick={() => handleStatusToggle(apartment)} className="dashboard-ghost-btn !px-3 !py-1.5">
                      {apartment.is_active ? 'Desactiver' : 'Activer'}
                    </button>
                    <button type="button" onClick={() => setDeleteItem(apartment)} className="rounded-xl bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white">
                      Supprimer
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <>
          <AdminTable headers={['Photo', 'Nom', 'Proprietaire', 'Prix', 'Capacite', 'Statut', 'Actions']}>
            {apartments.map((apartment) => (
              <tr key={apartment.id}>
                <td className="px-4 py-3">
                  <ApartmentImage
                    photos={apartment.photos}
                    alt={apartment.name}
                    className="h-12 w-12 overflow-hidden rounded-xl"
                    imageClassName="h-12 w-12 rounded-xl object-cover"
                  />
                </td>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{apartment.name}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{apartment.owner?.name}</td>
                <td className="px-4 py-3 text-sm text-slate-900">{formatCurrency(apartment.price_per_night)}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{apartment.capacity}</td>
                <td className="px-4 py-3"><StatusBadge label={apartment.is_active ? 'active' : 'inactive'} /></td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(apartment)}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                    >
                      Editer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(apartment)}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                    >
                      {apartment.is_active ? 'Desactiver' : 'Activer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteItem(apartment)}
                      className="rounded-lg bg-rose-600 px-2 py-1 text-xs text-white"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
        </>
      )}

      <Pagination meta={data} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />

      <ConfirmModal
        open={Boolean(deleteItem)}
        title="Supprimer cet appartement ?"
        description={deleteItem ? deleteItem.name : ''}
        onCancel={() => setDeleteItem(null)}
        onConfirm={handleDeleteApartment}
      />

      {showForm && <div className="hidden" />}
    </div>
  )
}

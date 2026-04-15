import { useCallback, useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import {
  ownerBlockDatesApi,
  ownerCalendarApi,
  ownerUnblockDatesApi,
} from '../../lib/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import PageHeader from '../../components/admin/PageHeader.jsx'
import LoadingState from '../../components/admin/LoadingState.jsx'
import ErrorState from '../../components/admin/ErrorState.jsx'

const initialForm = {
  apartment_id: '',
  start_date: '',
  end_date: '',
  reason: '',
}

export default function OwnerCalendarPage() {
  const { token } = useAuth()
  const [events, setEvents] = useState([])
  const [apartments, setApartments] = useState([])
  const [apartmentId, setApartmentId] = useState('')
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadCalendar = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await ownerCalendarApi(token, apartmentId ? { apartment_id: apartmentId } : {})
      setApartments(response.apartments ?? [])
      setEvents(response.events ?? [])
      if (!form.apartment_id && response.apartments?.[0]?.id) {
        setForm((prev) => ({ ...prev, apartment_id: String(response.apartments[0].id) }))
      }
    } catch (err) {
      setError(err.message ?? 'Unable to load calendar.')
    } finally {
      setLoading(false)
    }
  }, [apartmentId, form.apartment_id, token])

  useEffect(() => {
    loadCalendar()
  }, [loadCalendar])

  async function handleBlockDates(event) {
    event.preventDefault()
    setSubmitting(true)

    try {
      await ownerBlockDatesApi(token, {
        ...form,
        apartment_id: Number(form.apartment_id),
      })
      setForm((prev) => ({ ...prev, start_date: '', end_date: '', reason: '' }))
      await loadCalendar()
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEventClick(info) {
    const blockedId = info.event.extendedProps?.blocked_id
    if (!blockedId) return

    const shouldDelete = window.confirm('Unblock this period?')
    if (!shouldDelete) return

    await ownerUnblockDatesApi(token, blockedId)
    await loadCalendar()
  }

  if (loading) return <LoadingState label="Loading calendar..." />
  if (error) return <ErrorState message={error} onRetry={loadCalendar} />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Availability Calendar"
        description="Visualize reserved dates and block periods manually for each apartment."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="dashboard-surface p-4 xl:col-span-1">
          <h2 className="text-sm font-semibold text-slate-900">Block dates</h2>
          <form onSubmit={handleBlockDates} className="mt-4 space-y-3">
            <select
              required
              value={form.apartment_id}
              onChange={(event) => setForm((prev) => ({ ...prev, apartment_id: event.target.value }))}
              className="dashboard-select"
            >
              <option value="">Select apartment</option>
              {apartments.map((apartment) => (
                <option key={apartment.id} value={apartment.id}>
                  {apartment.name}
                </option>
              ))}
            </select>
            <input
              required
              type="date"
              value={form.start_date}
              onChange={(event) => setForm((prev) => ({ ...prev, start_date: event.target.value }))}
              className="dashboard-input"
            />
            <input
              required
              type="date"
              value={form.end_date}
              onChange={(event) => setForm((prev) => ({ ...prev, end_date: event.target.value }))}
              className="dashboard-input"
            />
            <input
              type="text"
              value={form.reason}
              onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))}
              placeholder="Reason (optional)"
              className="dashboard-input"
            />
            <button
              type="submit"
              disabled={submitting}
              className="dashboard-primary-btn w-full"
            >
              {submitting ? 'Blocking...' : 'Block dates'}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-4">
            <label htmlFor="calendar-filter" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Filter calendar
            </label>
            <select
              id="calendar-filter"
              value={apartmentId}
              onChange={(event) => setApartmentId(event.target.value)}
              className="dashboard-select"
            >
              <option value="">All apartments</option>
              {apartments.map((apartment) => (
                <option key={apartment.id} value={apartment.id}>
                  {apartment.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="dashboard-surface p-4 xl:col-span-2">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            height="auto"
            eventClick={handleEventClick}
          />
          <p className="mt-3 text-xs text-slate-500">Click a red blocked event to unblock it.</p>
        </section>
      </div>
    </div>
  )
}

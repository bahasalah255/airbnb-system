import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  apartmentAvailabilityApi,
  apartmentDetailsApi,
  createReservationApi,
} from '../../lib/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { ClientErrorState, ClientLoadingState } from '../../components/client/ClientFriendlyState.jsx'
import ApartmentImage from '../../components/apartments/ApartmentImage.jsx'
import { getApartmentGallery } from '../../utils/apartmentImages.js'
import { formatCurrency, formatDate } from '../../utils/format.js'

const initialForm = {
  check_in: '',
  check_out: '',
  phone: '',
  special_requests: '',
}

function daysBetween(start, end) {
  if (!start || !end) return 0
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diff = endDate.getTime() - startDate.getTime()
  if (Number.isNaN(diff) || diff <= 0) return 0
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

function isRangeAvailable(events, checkIn, checkOut) {
  if (!checkIn || !checkOut) return true

  const start = new Date(checkIn)
  const end = new Date(checkOut)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return false
  }

  return !events.some((event) => {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)

    if (Number.isNaN(eventStart.getTime()) || Number.isNaN(eventEnd.getTime())) {
      return false
    }

    return start < eventEnd && end > eventStart
  })
}

export default function ClientApartmentDetailsPage() {
  const { apartmentId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()

  const [apartment, setApartment] = useState(null)
  const [availability, setAvailability] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState('')

  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [detailsRes, availabilityRes] = await Promise.all([
        apartmentDetailsApi(apartmentId),
        apartmentAvailabilityApi(apartmentId),
      ])

      const loadedApartment = detailsRes.apartment
      setApartment(loadedApartment)
      setAvailability(Array.isArray(availabilityRes) ? availabilityRes : [])

      const gallery = getApartmentGallery(loadedApartment?.photos)
      setSelectedImage(gallery[0] ?? '')
    } catch (err) {
      setError(err.message ?? 'Unable to load apartment details.')
    } finally {
      setLoading(false)
    }
  }, [apartmentId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const gallery = useMemo(() => getApartmentGallery(apartment?.photos), [apartment])
  const nights = useMemo(() => daysBetween(form.check_in, form.check_out), [form.check_in, form.check_out])
  const total = useMemo(() => nights * Number(apartment?.price_per_night ?? 0), [nights, apartment?.price_per_night])
  const rangeAvailable = useMemo(
    () => isRangeAvailable(availability, form.check_in, form.check_out),
    [availability, form.check_in, form.check_out],
  )

  async function handleReservationSubmit(event) {
    event.preventDefault()
    setBookingError('')
    setBookingSuccess('')

    if (!form.check_in || !form.check_out || !form.phone) {
      setBookingError('Please complete check-in, check-out and phone number.')
      return
    }

    if (nights <= 0) {
      setBookingError('Check-out date must be after check-in date.')
      return
    }

    if (!rangeAvailable) {
      setBookingError('These dates are not available for this apartment.')
      return
    }

    setSubmitting(true)

    try {
      const latestAvailability = await apartmentAvailabilityApi(apartmentId)
      const stillAvailable = isRangeAvailable(latestAvailability, form.check_in, form.check_out)

      if (!stillAvailable) {
        setBookingError('This apartment has just been booked for your selected dates.')
        setAvailability(Array.isArray(latestAvailability) ? latestAvailability : [])
        return
      }

      await createReservationApi(token, {
        apartment_id: Number(apartmentId),
        check_in: form.check_in,
        check_out: form.check_out,
        phone: form.phone,
        special_requests: form.special_requests,
      })

      setBookingSuccess('Reservation created successfully. Redirecting to your reservations...')
      setForm(initialForm)
      setTimeout(() => {
        navigate('/client/reservations')
      }, 900)
    } catch (err) {
      setBookingError(err.message ?? 'Unable to create reservation.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <ClientLoadingState label="Loading apartment details..." />
  if (error) return <ClientErrorState message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <button
          type="button"
          onClick={() => navigate('/client')}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Back to Discover
        </button>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{apartment?.name}</h1>
        <p className="text-sm text-slate-600">{apartment?.address}</p>
      </section>

      <section className="grid gap-3 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)]">
          <ApartmentImage
            photos={[selectedImage || gallery[0]]}
            alt={apartment?.name}
            className="h-[320px] w-full bg-slate-100 sm:h-[400px]"
            imageClassName="h-full w-full object-cover"
          />
        </div>

        <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">About this place</p>
          <p className="mt-3 text-sm leading-7 text-slate-600">{apartment?.description}</p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Price</p>
              <p className="mt-1 font-semibold text-slate-900">{formatCurrency(apartment?.price_per_night)} / night</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Capacity</p>
              <p className="mt-1 font-semibold text-slate-900">{apartment?.capacity} guests</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {gallery.map((photo, index) => (
          <button
            key={`${photo}-${index}`}
            type="button"
            onClick={() => setSelectedImage(photo)}
            className={`overflow-hidden rounded-xl border transition ${
              selectedImage === photo ? 'border-slate-900 shadow-sm' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <ApartmentImage
              photos={[photo]}
              alt={`${apartment?.name} ${index + 1}`}
              className="h-28 w-full bg-slate-100"
              imageClassName="h-28 w-full object-cover"
            />
          </button>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)]">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Reserve this apartment</h2>
          <p className="mt-1 text-sm text-slate-600">Select your dates and confirm your booking.</p>

          <form onSubmit={handleReservationSubmit} className="mt-5 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="font-medium text-slate-700">Check-in</span>
                <input
                  type="date"
                  value={form.check_in}
                  onChange={(event) => setForm((prev) => ({ ...prev, check_in: event.target.value }))}
                  className="dashboard-input"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium text-slate-700">Check-out</span>
                <input
                  type="date"
                  value={form.check_out}
                  onChange={(event) => setForm((prev) => ({ ...prev, check_out: event.target.value }))}
                  className="dashboard-input"
                  min={form.check_in || new Date().toISOString().split('T')[0]}
                  required
                />
              </label>
            </div>

            <label className="space-y-1 text-sm">
              <span className="font-medium text-slate-700">Phone number</span>
              <input
                type="text"
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="Your phone number"
                className="dashboard-input"
                required
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="font-medium text-slate-700">Special requests (optional)</span>
              <textarea
                value={form.special_requests}
                onChange={(event) => setForm((prev) => ({ ...prev, special_requests: event.target.value }))}
                placeholder="Any special request?"
                className="dashboard-textarea"
                rows={3}
              />
            </label>

            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>Nights</span>
                <span className="font-semibold text-slate-900">{nights}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span>Total</span>
                <span className="font-semibold text-slate-900">{formatCurrency(total)}</span>
              </div>
              <p className={`mt-3 text-xs font-semibold ${rangeAvailable ? 'text-emerald-700' : 'text-rose-700'}`}>
                {rangeAvailable ? 'Selected dates appear available.' : 'Selected dates are currently unavailable.'}
              </p>
            </div>

            {bookingError && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {bookingError}
              </p>
            )}

            {bookingSuccess && (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {bookingSuccess}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !rangeAvailable || nights <= 0}
              className="dashboard-primary-btn"
            >
              {submitting ? 'Confirming...' : 'Reserve now'}
            </button>
          </form>
        </article>

        <article className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)]">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Availability preview</h2>
          <p className="mt-1 text-sm text-slate-600">Unavailable periods from existing bookings and blocked dates.</p>

          {(availability ?? []).length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              No blocked or reserved dates in the current schedule.
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              {availability.slice(0, 8).map((event, index) => (
                <div key={`${event.start}-${event.end}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <p className="font-semibold text-slate-900">{event.title}</p>
                  <p className="mt-1 text-slate-600">
                    {formatDate(event.start)} - {formatDate(event.end)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  )
}

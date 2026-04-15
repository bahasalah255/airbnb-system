import { useCallback, useEffect, useState } from 'react'
import {
  clientProfileApi,
  clientUpdatePasswordApi,
  clientUpdateProfileApi,
} from '../../lib/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import ClientSectionHeader from '../../components/client/ClientSectionHeader.jsx'
import ClientSectionCard from '../../components/client/ClientSectionCard.jsx'
import { ClientLoadingState, ClientErrorState } from '../../components/client/ClientFriendlyState.jsx'

const initialProfile = {
  name: '',
  email: '',
  phone: '',
}

const initialPassword = {
  current_password: '',
  password: '',
  password_confirmation: '',
}

export default function ClientProfilePage() {
  const { token } = useAuth()
  const [profile, setProfile] = useState(initialProfile)
  const [passwordForm, setPasswordForm] = useState(initialPassword)
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadProfile = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await clientProfileApi(token)
      setProfile({
        name: response.profile?.name ?? '',
        email: response.profile?.email ?? '',
        phone: response.profile?.phone ?? '',
      })
    } catch (err) {
      setError(err.message ?? 'Unable to load profile.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  async function handleProfileSubmit(event) {
    event.preventDefault()
    setSavingProfile(true)
    setSuccess('')
    setError('')

    try {
      const response = await clientUpdateProfileApi(token, profile)
      setProfile((prev) => ({
        ...prev,
        ...(response.profile ?? {}),
      }))
      setSuccess(response.message ?? 'Profile updated successfully.')
    } catch (err) {
      setError(err.message ?? 'Unable to update profile.')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault()
    setSavingPassword(true)
    setSuccess('')
    setError('')

    try {
      const response = await clientUpdatePasswordApi(token, passwordForm)
      setPasswordForm(initialPassword)
      setSuccess(response.message ?? 'Password changed successfully.')
    } catch (err) {
      setError(err.message ?? 'Unable to update password.')
    } finally {
      setSavingPassword(false)
    }
  }

  if (loading) return <ClientLoadingState label="Loading your profile..." />
  if (error && !profile.email) return <ClientErrorState message={error} onRetry={loadProfile} />

  return (
    <div className="space-y-6">
      <ClientSectionHeader
        eyebrow="Your account"
        title="Profile and settings"
        description="Keep your personal details and security up to date in a clear, friendly account space."
      />

      <section className="rounded-[1.6rem] border border-white/90 bg-gradient-to-r from-white to-sky-50/45 p-5 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.45)]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white">
            {(profile.name || 'U').slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{profile.name || 'Your profile'}</p>
            <p className="text-sm text-slate-600">{profile.email || 'No email yet'}</p>
          </div>
        </div>
      </section>

      {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
      {success && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p>}

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <ClientSectionCard title="Personal information" description="Keep your name, email and phone number up to date.">
          <form onSubmit={handleProfileSubmit} className="space-y-3">
            <input
              type="text"
              required
              value={profile.name}
              onChange={(event) => setProfile((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Full name"
              className="dashboard-input"
            />
            <input
              type="email"
              required
              value={profile.email}
              onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="Email"
              className="dashboard-input"
            />
            <input
              type="text"
              value={profile.phone}
              onChange={(event) => setProfile((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="Phone"
              className="dashboard-input"
            />
            <button
              type="submit"
              disabled={savingProfile}
              className="dashboard-primary-btn mt-2"
            >
              {savingProfile ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </ClientSectionCard>

        <ClientSectionCard title="Security" description="Update your password whenever you need a quick refresh.">
          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <input
              type="password"
              required
              value={passwordForm.current_password}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, current_password: event.target.value }))}
              placeholder="Current password"
              className="dashboard-input"
            />
            <input
              type="password"
              required
              value={passwordForm.password}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, password: event.target.value }))}
              placeholder="New password"
              className="dashboard-input"
            />
            <input
              type="password"
              required
              value={passwordForm.password_confirmation}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, password_confirmation: event.target.value }))}
              placeholder="Confirm new password"
              className="dashboard-input"
            />
            <button
              type="submit"
              disabled={savingPassword}
              className="dashboard-primary-btn mt-2"
            >
              {savingPassword ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </ClientSectionCard>
      </section>
    </div>
  )
}

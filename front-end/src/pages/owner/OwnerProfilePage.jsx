import { useCallback, useEffect, useState } from 'react'
import {
  ownerProfileApi,
  ownerUpdatePasswordApi,
  ownerUpdateProfileApi,
} from '../../lib/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import PageHeader from '../../components/admin/PageHeader.jsx'
import LoadingState from '../../components/admin/LoadingState.jsx'
import ErrorState from '../../components/admin/ErrorState.jsx'

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

export default function OwnerProfilePage() {
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
      const response = await ownerProfileApi(token)
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
      const response = await ownerUpdateProfileApi(token, profile)
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
      const response = await ownerUpdatePasswordApi(token, passwordForm)
      setPasswordForm(initialPassword)
      setSuccess(response.message ?? 'Password changed successfully.')
    } catch (err) {
      setError(err.message ?? 'Unable to update password.')
    } finally {
      setSavingPassword(false)
    }
  }

  if (loading) return <LoadingState label="Loading profile..." />
  if (error && !profile.email) return <ErrorState message={error} onRetry={loadProfile} />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile & Settings"
        description="Update your personal info and keep your account secure."
      />

      {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
      {success && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p>}

      <section className="grid gap-6 xl:grid-cols-2">
        <form onSubmit={handleProfileSubmit} className="dashboard-surface p-5">
          <h2 className="text-sm font-semibold text-slate-900">Profile information</h2>
          <div className="mt-4 space-y-3">
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
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="dashboard-primary-btn mt-4"
          >
            {savingProfile ? 'Saving...' : 'Save profile'}
          </button>
        </form>

        <form onSubmit={handlePasswordSubmit} className="dashboard-surface p-5">
          <h2 className="text-sm font-semibold text-slate-900">Change password</h2>
          <div className="mt-4 space-y-3">
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
          </div>
          <button
            type="submit"
            disabled={savingPassword}
            className="dashboard-primary-btn mt-4"
          >
            {savingPassword ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </section>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function OwnerTopbar() {
  const [search, setSearch] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logout()
      navigate('/login', { replace: true })
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full max-w-xl">
          <label htmlFor="owner-search" className="sr-only">
            Search
          </label>
          <input
            id="owner-search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search apartments, clients or reservations..."
            className="dashboard-input"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/owner/notifications')}
            className="dashboard-ghost-btn"
          >
            Notifications
          </button>
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
            <p className="font-semibold text-slate-900">{user?.name}</p>
            <p className="text-xs text-slate-500">Owner</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="dashboard-primary-btn"
          >
            {loggingOut ? '...' : 'Logout'}
          </button>
        </div>
      </div>
    </header>
  )
}

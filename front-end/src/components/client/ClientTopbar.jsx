import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const links = [
  { to: '/client', label: 'Home', end: true },
  { to: '/client/reservations', label: 'Reservations' },
  { to: '/client/favorites', label: 'Favorites' },
  { to: '/client/profile', label: 'Profile' },
]

export default function ClientTopbar() {
  const { user, logout, isLoadingAuth } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

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
    <header className="sticky top-0 z-20 border-b border-white/90 bg-white/80 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate('/client')}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-left transition hover:border-slate-300"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-amber-100 to-sky-100 text-xs font-bold text-slate-700">
              B
            </span>
            <span>
              <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-amber-700">Discovery</span>
              <span className="block text-sm font-semibold text-slate-900">Booking Space</span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 sm:block">
              <p className="text-xs text-slate-500">{isLoadingAuth ? 'Loading...' : 'Welcome back'}</p>
              <p className="text-sm font-semibold text-slate-900">{user?.name ?? 'Guest'}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="dashboard-primary-btn"
            >
              {loggingOut ? 'Signing out...' : 'Logout'}
            </button>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-[0_10px_24px_-16px_rgba(15,23,42,0.7)]'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={() => navigate('/client/favorites')}
            className="whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
          >
            Discover stays
          </button>
        </nav>
      </div>
    </header>
  )
}

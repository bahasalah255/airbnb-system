import { NavLink } from 'react-router-dom'

const links = [
  { to: '/owner', label: 'Overview', end: true },
  { to: '/owner/apartments', label: 'My Apartments' },
  { to: '/owner/reservations', label: 'Reservations' },
  { to: '/owner/calendar', label: 'Availability' },
  { to: '/owner/analytics', label: 'Analytics' },
  { to: '/owner/profile', label: 'Profile' },
]

export default function OwnerSidebar() {
  return (
    <aside className="hidden w-[18.5rem] flex-col border-r border-slate-200/80 bg-gradient-to-b from-white to-slate-50 p-6 lg:flex">
      <div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Owner Studio</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Property Hub</h2>
        <p className="mt-2 text-xs text-slate-500">Your premium workspace for listings, bookings and revenue insights.</p>
      </div>

      <nav className="mt-8 space-y-1.5">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `group flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-slate-900 text-white shadow-[0_12px_28px_-14px_rgba(15,23,42,0.7)]'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-slate-200/90 bg-white p-4 text-sm text-slate-600 shadow-[0_10px_26px_-20px_rgba(15,23,42,0.7)]">
        <p className="font-semibold text-slate-900">Owner dashboard</p>
        <p className="mt-1 text-xs leading-relaxed">Manage listings, occupancy, revenue and client activity from one clean control panel.</p>
      </div>
    </aside>
  )
}

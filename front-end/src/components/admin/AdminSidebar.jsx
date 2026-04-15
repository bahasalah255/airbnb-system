import { NavLink } from 'react-router-dom'

const links = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/users', label: 'Utilisateurs' },
  { to: '/admin/apartments', label: 'Appartements' },
  { to: '/admin/reservations', label: 'Reservations' },
  { to: '/admin/owners', label: 'Proprietaires' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/notifications', label: 'Activite' },
  { to: '/admin/settings', label: 'Parametres' },
]

export default function AdminSidebar() {
  return (
    <aside className="hidden w-[18.5rem] flex-col border-r border-slate-200/80 bg-gradient-to-b from-white to-slate-50 p-6 lg:flex">
      <div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">RBNB Admin</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Control Center</h2>
        <p className="mt-2 text-xs text-slate-500">Operational command for rentals, users and platform health.</p>
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
        <p className="font-semibold text-slate-900">Admin workspace</p>
        <p className="mt-1 text-xs leading-relaxed">Centralized control over users, listings and reservations with audit-grade visibility.</p>
      </div>
    </aside>
  )
}

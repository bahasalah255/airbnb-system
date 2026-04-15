import { NavLink } from 'react-router-dom'

const links = [
  { to: '/client', label: 'Dashboard', end: true },
  { to: '/client/reservations', label: 'Reservations' },
  { to: '/client/favorites', label: 'Favorites' },
  { to: '/client/profile', label: 'Profile' },
]

export default function ClientSidebar() {
  return (
    <aside className="hidden w-[19rem] flex-col border-r border-white/80 bg-gradient-to-b from-white via-amber-50/30 to-slate-50/70 p-6 lg:flex">
      <div className="rounded-[1.6rem] border border-white/80 bg-white/90 p-5 shadow-[0_16px_36px_-30px_rgba(15,23,42,0.55)]">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-amber-700">Client space</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">My travels</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          A calm personal space for reservations, favorites and account details.
        </p>
        <div className="mt-4 rounded-2xl bg-gradient-to-br from-amber-50 to-white p-4 ring-1 ring-amber-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Travel tip</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Save apartments you like and return to them anytime from Favorites.
          </p>
        </div>
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

      <div className="mt-auto rounded-[1.6rem] border border-white/80 bg-white p-4 text-sm text-slate-600 shadow-[0_14px_34px_-26px_rgba(15,23,42,0.55)]">
        <p className="font-semibold text-slate-900">Need something later?</p>
        <p className="mt-1 text-xs leading-relaxed">
          Everything important stays close: reservations, favorites and your profile.
        </p>
      </div>
    </aside>
  )
}

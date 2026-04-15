import { Outlet } from 'react-router-dom'
import OwnerSidebar from './OwnerSidebar.jsx'
import OwnerTopbar from './OwnerTopbar.jsx'

export default function OwnerLayout() {
  return (
    <div className="min-h-screen px-0 text-slate-900 lg:px-4 lg:py-4">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px] overflow-hidden lg:rounded-[1.4rem] lg:border lg:border-slate-200/70 lg:bg-white/70 lg:shadow-[0_24px_70px_-28px_rgba(15,23,42,0.45)] lg:backdrop-blur">
        <OwnerSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <OwnerTopbar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

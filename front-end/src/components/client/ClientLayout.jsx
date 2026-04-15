import { Outlet } from 'react-router-dom'
import ClientTopbar from './ClientTopbar.jsx'

export default function ClientLayout() {
  return (
    <div className="min-h-screen px-3 pb-4 pt-3 text-slate-900 sm:px-5 lg:px-8 lg:py-6">
      <div className="mx-auto w-full max-w-[1380px]">
        <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/65 shadow-[0_30px_80px_-42px_rgba(15,23,42,0.4)] backdrop-blur-xl">
          <ClientTopbar />
          <main className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

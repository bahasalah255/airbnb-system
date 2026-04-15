export default function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#dbeafe_0%,_rgba(219,234,254,0)_36%),radial-gradient(circle_at_bottom_right,_#e2e8f0_0%,_rgba(226,232,240,0)_34%),#f3f6fb] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 shadow-[0_28px_80px_-36px_rgba(15,23,42,0.65)] backdrop-blur lg:grid-cols-2">
        <section className="relative hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">RBNB Platform</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">Hospitality operations, simplified.</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300">
              Manage apartments, reservations, availability and analytics through one modern control center.
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-5 text-sm text-slate-200">
            <p className="font-medium text-white">Secure access</p>
            <p className="mt-2 leading-relaxed">
              Your account is protected with token-based authentication and role-scoped permissions.
            </p>
          </div>
        </section>

        <section className="flex items-center p-5 sm:p-8 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <header className="mb-6 space-y-2 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Authentication</p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
              <p className="text-sm leading-relaxed text-slate-600">{subtitle}</p>
            </header>
            {children}
          </div>
        </section>
      </div>
    </main>
  )
}

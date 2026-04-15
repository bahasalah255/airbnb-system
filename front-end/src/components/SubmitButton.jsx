export default function SubmitButton({ isLoading, children }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_-14px_rgba(15,23,42,0.7)] transition hover:-translate-y-0.5 hover:from-slate-800 hover:to-slate-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
    >
      {isLoading ? 'Please wait...' : children}
    </button>
  )
}

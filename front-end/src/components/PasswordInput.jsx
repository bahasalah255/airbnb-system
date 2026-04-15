import { useState } from 'react'

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  required = false,
}) {
  const [isVisible, setIsVisible] = useState(false)
  const hasError = Boolean(error)

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-[0.11em] text-slate-600">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={`w-full rounded-xl border px-4 py-2.5 pr-20 text-sm text-slate-900 shadow-sm transition outline-none placeholder:text-slate-400 ${
            hasError
              ? 'border-rose-300 bg-rose-50/60 focus:border-rose-400 focus:ring-4 focus:ring-rose-100'
              : 'border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100'
          }`}
        />
        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          {isVisible ? 'Hide' : 'Show'}
        </button>
      </div>
      {hasError && (
        <p id={`${id}-error`} className="text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  )
}

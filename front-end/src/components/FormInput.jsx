export default function FormInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  required = false,
}) {
  const hasError = Boolean(error)

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-[0.11em] text-slate-600">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 shadow-sm transition outline-none placeholder:text-slate-400 ${
          hasError
            ? 'border-rose-300 bg-rose-50/60 focus:border-rose-400 focus:ring-4 focus:ring-rose-100'
            : 'border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100'
        }`}
      />
      {hasError && (
        <p id={`${id}-error`} className="text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  )
}

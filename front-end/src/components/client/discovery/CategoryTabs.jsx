export default function CategoryTabs({ value, onChange, items }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item) => {
        const active = value === item.value

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active
                ? 'bg-slate-900 text-white shadow-[0_10px_24px_-16px_rgba(15,23,42,0.75)]'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

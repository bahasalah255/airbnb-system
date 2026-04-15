export default function AdminFilters({ children }) {
  return (
    <div className="dashboard-surface dashboard-filter-panel mb-4 grid gap-3 p-4 sm:grid-cols-3 [&_input]:dashboard-input [&_select]:dashboard-select [&_textarea]:dashboard-textarea [&_button]:dashboard-ghost-btn">
      {children}
    </div>
  )
}

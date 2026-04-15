export default function AdminTable({ headers, children }) {
  return (
    <div className="dashboard-surface overflow-hidden">
      <div className="dashboard-scroll overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/90">
          <thead className="bg-slate-50/85">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3.5 text-left text-[0.68rem] font-semibold uppercase tracking-[0.11em] text-slate-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/85 bg-white [&_tr]:transition [&_tr:hover]:bg-slate-50/65 [&_td]:px-4 [&_td]:py-3.5">{children}</tbody>
        </table>
      </div>
    </div>
  )
}

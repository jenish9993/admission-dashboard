// src/components/ApplicationsTable.jsx
import { getBadgeColor, formatDate } from "../utils/helpers";

const ApplicationsTable = ({ data = [] }) => {

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <span className="text-5xl mb-4">🗂️</span>
        <p className="text-sm font-medium">No applications to display</p>
        <p className="text-xs mt-1 text-slate-600">Try refreshing or adjusting filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] text-sm">

        {/* Head */}
        <thead>
          <tr className="border-b border-slate-700/60">
            {["App ID", "Applicant Name", "Program", "Status", "Date"].map((col) => (
              <th
                key={col}
                className="text-left text-xs font-semibold text-slate-400 uppercase tracking-widest py-3 px-4"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.id}
              className={`
                border-b border-slate-800/60
                hover:bg-slate-700/30 transition-colors duration-150
                ${idx % 2 === 0 ? "" : "bg-slate-800/20"}
              `}
            >
              <td className="py-3.5 px-4 text-indigo-400 font-mono font-semibold">
                {row.id}
              </td>
              <td className="py-3.5 px-4 text-slate-200 font-medium">
                {row.name}
              </td>
              <td className="py-3.5 px-4 text-slate-400">
                {row.program}
              </td>
              <td className="py-3.5 px-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getBadgeColor(row.status)}`}>
                  {row.status}
                </span>
              </td>
              <td className="py-3.5 px-4 text-slate-400 text-xs">
                {formatDate(row.date)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationsTable;
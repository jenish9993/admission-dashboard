// src/components/DateFilter.jsx
import { useState } from "react";
import { useDashboard } from "../context/DashboardContext";
import { isValidDateRange } from "../utils/helpers";
import moment from "moment";

const DateFilter = () => {
  const { dateFilter, applyDateFilter, clearFilter, loading } = useDashboard();

  const [from, setFrom] = useState(dateFilter.from);
  const [to,   setTo]   = useState(dateFilter.to);
  const [error, setError] = useState("");

  const handleApply = async () => {
    if (!isValidDateRange(from, to)) {
      setError("'From' date must be before or equal to 'To' date.");
      return;
    }
    setError("");
    await applyDateFilter(from, to);
  };

  const handleClear = async () => {
    setFrom("");
    setTo("");
    setError("");
    await clearFilter();
  };

  const today = moment().format("YYYY-MM-DD");

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end flex-wrap">

      {/* FROM */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400 font-medium uppercase tracking-wide">
          From
        </label>
        <input
          type="date"
          value={from}
          max={to || today}
          onChange={(e) => { setFrom(e.target.value); setError(""); }}
          className="bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     cursor-pointer"
        />
      </div>

      {/* TO */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400 font-medium uppercase tracking-wide">
          To
        </label>
        <input
          type="date"
          value={to}
          min={from}
          max={today}
          onChange={(e) => { setTo(e.target.value); setError(""); }}
          className="bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     cursor-pointer"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-1 sm:mt-0">
        <button
          onClick={handleApply}
          disabled={loading || (!from && !to)}
          className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500
                     disabled:opacity-40 disabled:cursor-not-allowed
                     text-white rounded-lg transition-colors duration-200 shadow"
        >
          Apply
        </button>
        <button
          onClick={handleClear}
          disabled={loading || (!from && !to)}
          className="px-4 py-2 text-sm font-semibold bg-slate-700 hover:bg-slate-600
                     disabled:opacity-40 disabled:cursor-not-allowed
                     text-slate-200 rounded-lg transition-colors duration-200"
        >
          Clear
        </button>
      </div>

      {/* Validation error */}
      {error && (
        <p className="w-full text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
};

export default DateFilter;
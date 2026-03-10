// src/utils/helpers.js
import moment from "moment";

// Returns Tailwind text color based on value threshold
export const getCountColor = (value) => {
  if (value > 1000) return "text-red-500";
  if (value > 500)  return "text-orange-400";
  return "text-slate-100";
};

// Returns Tailwind badge classes for application status
export const getBadgeColor = (status) => {
  const map = {
    Verified: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    Pending:  "bg-amber-500/20  text-amber-400  border border-amber-500/30",
    Rejected: "bg-red-500/20    text-red-400    border border-red-500/30",
  };
  return map[status] || "bg-slate-500/20 text-slate-400";
};

// Format date: "2024-04-20" → "Apr 20, 2024"
export const formatDate = (isoDate, fmt = "MMM DD, YYYY") => {
  if (!isoDate) return "—";
  return moment(isoDate).format(fmt);
};

// Short date for chart labels: "2024-04-20" → "Apr 20"
export const formatShortDate = (isoDate) =>
  moment(isoDate).format("MMM D");

// Add comma separators: 1240 → "1,240"
export const formatNumber = (n) =>
  n?.toLocaleString("en-US") ?? "—";

// Returns true if from <= to (or either is empty)
export const isValidDateRange = (from, to) => {
  if (!from || !to) return true;
  return moment(from).isSameOrBefore(to);
};
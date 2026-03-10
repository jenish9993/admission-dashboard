// src/components/StatCard.jsx
import { getCountColor, formatNumber } from "../utils/helpers";

const StatCard = ({ label, value, icon, gradient }) => {
  const valueColor = getCountColor(value);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-800/60 backdrop-blur border border-slate-700/50 p-6 flex items-center gap-5 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${gradient}`} />

      {/* Icon */}
      <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
        {icon}
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className="text-slate-400 text-sm font-medium tracking-wide uppercase">
          {label}
        </span>
        <span className={`text-3xl font-extrabold mt-1 ${valueColor}`}>
          {formatNumber(value)}
        </span>

        {/* {value > 1000 && (
          <span className="mt-1 text-xs font-semibold text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full w-fit">
            ⚠ Critical
          </span>
        )}
        {value > 500 && value <= 1000 && (
          <span className="mt-1 text-xs font-semibold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full w-fit">
            ● High Volume
          </span>
        )} */}
      </div>
    </div>
  );
};

export default StatCard;
// src/components/LoadingSkeleton.jsx
const Pulse = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-700/50 rounded-xl ${className}`} />
);

const LoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <Pulse key={i} className="h-28" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Pulse className="h-80" />
      <Pulse className="h-80" />
    </div>
    <Pulse className="h-72" />
  </div>
);

export default LoadingSkeleton;
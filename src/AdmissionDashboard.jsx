// src/AdmissionDashboard.jsx
import { useEffect, useRef } from "react";
import moment from "moment";

import { DashboardProvider, useDashboard } from "./context/DashboardContext";
import StatCard from "./components/StatCard";
import ProgramBarChart from "./components/ProgramBarChart";
import TrendLineChart from "./components/TrendLineChart";
import DateFilter from "./components/DateFilter";
import ApplicationsTable from "./components/ApplicationsTable";
import LoadingSkeleton from "./components/LoadingSkeleton";

// ============================================================
// Inner content — has access to context via useDashboard hook
// ============================================================
const DashboardContent = () => {
    const { loading, error, summary, perProgram, trends, recentApplications, lastFetched, loadData } = useDashboard();

    const hasFetched = useRef(false);

    useEffect(() => {
        // only fetch once
        if (hasFetched.current) return;
        hasFetched.current = true;
        loadData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Error state
    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                {/* Icon */}
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                    <svg
                        className="w-10 h-10 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                    </svg>
                </div>

                {/* Message */}
                <h2 className="text-xl font-bold text-red-400 mb-2">Something Went Wrong</h2>
                <p className="text-slate-400 text-sm mb-2 max-w-sm">{error}</p>
                <p className="text-slate-600 text-xs mb-8 max-w-sm">
                    Please check your internet connection or try again later.
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={loadData}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500
                     text-white font-semibold rounded-xl transition-colors shadow-lg"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 4v5h.582M20 20v-5h-.581M5.635 19A9 9 0 104.582 9H4"
                            />
                        </svg>
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600
                     text-slate-200 font-semibold rounded-xl transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        );
    }

    // Loading skeleton on first load
    if (loading && !summary) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* ── HEADER ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
                        Admission Analytics
                    </h1>
                    {lastFetched && (
                        <p className="text-xs text-slate-500 mt-1">
                            Last updated: {moment(lastFetched).format("MMM D, YYYY [at] h:mm A")}
                        </p>
                    )}
                </div>

                {/* Refresh button */}
                <button
                    onClick={loadData}
                    disabled={loading}
                    className={`
    relative flex items-center gap-2 px-5 py-2.5 text-sm font-semibold
    text-white rounded-xl shadow-lg shadow-indigo-900/40
    transition-all duration-200 active:scale-95 w-fit
    overflow-hidden
    ${loading ? "bg-indigo-700 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500 cursor-pointer"}
  `}
                >
                    {/* Animated shimmer bar when loading */}
                    {loading && (
                        <span className="absolute inset-0 w-full h-full">
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1s_infinite] -translate-x-full" />
                        </span>
                    )}

                    {/* Spinner icon */}
                    {loading ? (
                        <svg className="animate-spin w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                    ) : (
                        <svg
                            className="w-4 h-4 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 4v5h.582M20 20v-5h-.581M5.635 19A9 9 0 104.582 9H4"
                            />
                        </svg>
                    )}

                    {/* Button text */}
                    <span>{loading ? "Refreshing…" : "Refresh"}</span>

                    {/* Pulsing dot when loading */}
                    {loading && (
                        <span className="flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white opacity-90" />
                        </span>
                    )}
                </button>
            </div>

            {/* ── STAT CARDS ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    label="Total Applicants"
                    value={summary?.totalApplicants ?? 0}
                    icon="🎓"
                    gradient="from-indigo-500 to-purple-600"
                />
                <StatCard
                    label="Verified Applicants"
                    value={summary?.verifiedApplicants ?? 0}
                    icon="✅"
                    gradient="from-emerald-500 to-teal-600"
                />
                <StatCard
                    label="Rejected Applicants"
                    value={summary?.rejectedApplicants ?? 0}
                    icon="❌"
                    gradient="from-red-500 to-rose-600"
                />
            </div>

            {/* ── CHARTS ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                    <h2 className="text-base font-bold text-slate-200 mb-5">📊 Applications per Program</h2>
                    <ProgramBarChart data={perProgram} />
                </div>

                {/* Line Chart + Date Filter */}
                <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                    <div className="flex flex-col gap-4 mb-5">
                        <h2 className="text-base font-bold text-slate-200">📈 Application Trends</h2>
                        <DateFilter />
                    </div>
                    <TrendLineChart data={trends} />
                </div>
            </div>

            {/* ── TABLE ── */}
            <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                <h2 className="text-base font-bold text-slate-200 mb-5">🗂️ Recent Applications</h2>
                <ApplicationsTable data={recentApplications} />
            </div>
        </div>
    );
};

// ============================================================
// Root export — wraps everything in DashboardProvider
// ============================================================
const AdmissionDashboard = () => (
    <DashboardProvider>
        <div className="min-h-screen bg-slate-900 text-slate-100">
            {/* Nav bar */}
            <nav className="bg-slate-800/80 backdrop-blur border-b border-slate-700/50 px-4 md:px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm font-bold">
                        U
                    </div>
                    <span className="font-bold text-slate-100 text-lg tracking-tight">University Admin Portal</span>
                    <span className="ml-auto text-xs text-slate-500 hidden sm:block">
                        {moment().format("dddd, MMMM D YYYY")}
                    </span>
                </div>
            </nav>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                <DashboardContent />
            </main>
        </div>
    </DashboardProvider>
);

export default AdmissionDashboard;

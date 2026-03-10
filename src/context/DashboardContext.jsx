// src/context/DashboardContext.jsx
import { createContext, useContext, useReducer, useCallback, useRef } from "react";
import { fetchAdmissionAnalytics, fetchTrendsByDateRange } from "../api/analytics";

// ──────────────────────────────────────────────
// 1. INITIAL STATE
// ──────────────────────────────────────────────
const initialState = {
    loading: false,
    error: null,
    summary: null,
    perProgram: [],
    trends: [],
    recentApplications: [],
    dateFilter: { from: "", to: "" },
    lastFetched: null,
};

// ──────────────────────────────────────────────
// 2. ACTION TYPES
// ──────────────────────────────────────────────
export const ACTIONS = {
    FETCH_START: "FETCH_START",
    FETCH_SUCCESS: "FETCH_SUCCESS",
    FETCH_ERROR: "FETCH_ERROR",
    SET_DATE_FILTER: "SET_DATE_FILTER",
    CLEAR_DATE_FILTER: "CLEAR_DATE_FILTER",
    UPDATE_TRENDS: "UPDATE_TRENDS",
};

// ──────────────────────────────────────────────
// 3. REDUCER
// ──────────────────────────────────────────────
const dashboardReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.FETCH_START:
            return { ...state, loading: true, error: null };

        case ACTIONS.FETCH_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                summary: action.payload.summary,
                perProgram: action.payload.perProgram,
                trends: action.payload.trends,
                recentApplications: action.payload.recentApplications,
                lastFetched: Date.now(),
            };

        case ACTIONS.FETCH_ERROR:
            return { ...state, loading: false, error: action.payload };

        case ACTIONS.SET_DATE_FILTER:
            return {
                ...state,
                dateFilter: { ...state.dateFilter, ...action.payload },
            };

        case ACTIONS.CLEAR_DATE_FILTER:
            return { ...state, dateFilter: { from: "", to: "" } };

        case ACTIONS.UPDATE_TRENDS:
            return { ...state, trends: action.payload, loading: false };

        default:
            return state;
    }
};

// ──────────────────────────────────────────────
// 4. CREATE CONTEXT
// ──────────────────────────────────────────────
const DashboardContext = createContext(null);

// ──────────────────────────────────────────────
// 5. PROVIDER
// ──────────────────────────────────────────────
export const DashboardProvider = ({ children }) => {
    const [state, dispatch] = useReducer(dashboardReducer, initialState);

    // ── prevents double API call ──
    const hasFetched = useRef(false);

    // ── validate and sanitize API response ──
    const sanitizeData = (data) => {
        return {
            summary: {
                totalApplicants: data?.summary?.totalApplicants ?? 0,
                verifiedApplicants: data?.summary?.verifiedApplicants ?? 0,
                rejectedApplicants: data?.summary?.rejectedApplicants ?? 0,
            },
            perProgram: Array.isArray(data?.perProgram) ? data.perProgram : [],
            trends: Array.isArray(data?.trends) ? data.trends : [],
            recentApplications: Array.isArray(data?.recentApplications) ? data.recentApplications : [],
        };
    };

    // ── load all data ──
    const loadData = useCallback(async () => {
        dispatch({ type: ACTIONS.FETCH_START });
        try {
            const raw = await fetchAdmissionAnalytics();

            // check if response is empty or null
            if (!raw || typeof raw !== "object") {
                dispatch({
                    type: ACTIONS.FETCH_ERROR,
                    payload: "API returned empty or invalid response.",
                });
                return;
            }

            // sanitize and fill missing fields with defaults
            const data = sanitizeData(raw);
            dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
        } catch (err) {
            dispatch({
                type: ACTIONS.FETCH_ERROR,
                payload: err?.message || "Failed to fetch analytics data.",
            });
        }
    }, []);

    // ── apply date filter ──
    const applyDateFilter = useCallback(async (from, to) => {
        dispatch({ type: ACTIONS.SET_DATE_FILTER, payload: { from, to } });
        dispatch({ type: ACTIONS.FETCH_START });
        try {
            const raw = await fetchTrendsByDateRange(from, to);

            if (!raw || typeof raw !== "object") {
                dispatch({
                    type: ACTIONS.FETCH_ERROR,
                    payload: "API returned empty or invalid response.",
                });
                return;
            }

            const trends = Array.isArray(raw?.trends) ? raw.trends : [];

            // if filtered trends are empty show friendly message
            if (trends.length === 0) {
                dispatch({
                    type: ACTIONS.FETCH_ERROR,
                    payload: "No trend data found for the selected date range.",
                });
                return;
            }

            dispatch({ type: ACTIONS.UPDATE_TRENDS, payload: trends });
        } catch (err) {
            dispatch({
                type: ACTIONS.FETCH_ERROR,
                payload: err?.message || "Failed to filter trend data.",
            });
        }
    }, []);

    const clearFilter = useCallback(async () => {
        dispatch({ type: ACTIONS.CLEAR_DATE_FILTER });
        await loadData();
    }, [loadData]);

    return (
        <DashboardContext.Provider value={{ ...state, loadData, applyDateFilter, clearFilter }}>
            {children}
        </DashboardContext.Provider>
    );
};

// ──────────────────────────────────────────────
// 6. CUSTOM HOOK
// Usage: const { summary, loading, loadData } = useDashboard();
// ──────────────────────────────────────────────
export const useDashboard = () => {
    const ctx = useContext(DashboardContext);
    if (!ctx) {
        throw new Error("useDashboard must be used inside <DashboardProvider>");
    }
    return ctx;
};

export default DashboardContext;

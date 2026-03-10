// src/api/analytics.js
import axios from "axios";

// ──────────────────────────────────────────────
// Beeceptor Mock API URL
// ──────────────────────────────────────────────
const BASE_URL = "https://admission-dashboard.free.beeceptor.com";

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 8000,
    headers: { "Content-Type": "application/json" },
});
export const fetchAdmissionAnalytics = async () => {
    const response = await apiClient.get("/api/v1/analytics/admissions");

    // check if response has data
    if (!response || !response.data) {
        throw new Error("No data received from API.");
    }

    return response.data;
};

export const fetchTrendsByDateRange = async (from, to) => {
    const response = await apiClient.get("/api/v1/analytics/admissions");

    // check if response has data
    if (!response || !response.data) {
        throw new Error("No data received from API.");
    }

    const data = response.data;

    if (!from && !to) return data;

    const filtered =
        data.trends?.filter((item) => {
            const d = new Date(item.date);
            const start = from ? new Date(from) : new Date("2000-01-01");
            const end = to ? new Date(to) : new Date("2100-01-01");
            return d >= start && d <= end;
        }) ?? [];

    return { ...data, trends: filtered };
};

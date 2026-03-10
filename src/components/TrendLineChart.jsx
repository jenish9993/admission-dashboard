// src/components/TrendLineChart.jsx
import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { formatShortDate } from "../utils/helpers";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TrendLineChart = ({ data = [] }) => {

  const chartData = useMemo(() => {
    const labels = data.map((d) => formatShortDate(d.date));
    const counts = data.map((d) => d.applications);

    return {
      labels,
      datasets: [
        {
          label: "Applications",
          data: counts,
          borderColor: "#818cf8",
          backgroundColor: (ctx) => {
            const chart = ctx.chart;
            const { ctx: canvasCtx, chartArea } = chart;
            if (!chartArea) return "transparent";
            const gradient = canvasCtx.createLinearGradient(
              0, chartArea.top, 0, chartArea.bottom
            );
            gradient.addColorStop(0, "rgba(129,140,248,0.4)");
            gradient.addColorStop(1, "rgba(129,140,248,0.0)");
            return gradient;
          },
          borderWidth: 2.5,
          pointBackgroundColor: "#818cf8",
          pointRadius: 4,
          pointHoverRadius: 7,
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#94a3b8",
        bodyColor: "#f1f5f9",
        borderColor: "#334155",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          title: (items) => items[0]?.label ?? "",
          label: (ctx) => ` ${ctx.parsed.y.toLocaleString()} applications`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#94a3b8",
          font: { size: 10 },
          maxTicksLimit: 10,
          maxRotation: 30,
        },
        grid: { display: false },
        border: { color: "#334155" },
      },
      y: {
        ticks: {
          color: "#94a3b8",
          font: { size: 11 },
          callback: (v) => v.toLocaleString(),
        },
        grid: { color: "#1e293b" },
        border: { color: "#334155" },
      },
    },
  };

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <span className="text-4xl mb-3">📈</span>
        <p className="text-sm">No trend data for the selected date range</p>
      </div>
    );
  }

  return (
    <div className="h-64 md:h-80">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TrendLineChart;
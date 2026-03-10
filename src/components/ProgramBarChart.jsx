// src/components/ProgramBarChart.jsx
import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProgramBarChart = ({ data = [] }) => {

  const chartData = useMemo(() => {
    const labels = data.map((d) => d.program);
    const counts = data.map((d) => d.count);

    // Dynamic colors based on threshold
    const backgroundColors = counts.map((c) =>
      c > 1000 ? "rgba(239,68,68,0.75)"
      : c > 500  ? "rgba(251,146,60,0.75)"
      :            "rgba(99,102,241,0.75)"
    );
    const borderColors = counts.map((c) =>
      c > 1000 ? "#ef4444"
      : c > 500  ? "#fb923c"
      :            "#6366f1"
    );

    return {
      labels,
      datasets: [
        {
          label: "Applications",
          data: counts,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
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
          label: (ctx) => ` ${ctx.parsed.y.toLocaleString()} applications`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8", font: { size: 11 }, maxRotation: 30 },
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
        <span className="text-4xl mb-3">📊</span>
        <p className="text-sm">No program data available</p>
      </div>
    );
  }

  return (
    <div className="h-64 md:h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ProgramBarChart;
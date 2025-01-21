import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  ScriptableContext,
  Filler,
  LegendItem,
  TooltipItem,
} from "chart.js";

// Register the necessary components with Chart.js
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

const data: ChartData<"line"> = {
  labels: [
    "Jan'24",
    "Feb'24",
    "Mar'24",
    "Apr'24",
    "May'24",
    "Jun'24",
    "Jul'24",
    "Aug'24",
    "Sep'24",
    "Oct'24",
    "Nov'24",
    "Dec'24",
  ],
  datasets: [
    {
      label: "",
      data: [0, 20, 80, 25, 56, 9, 35, 14, 45, 30, 8, 32],
      fill: true,
      backgroundColor: (ctx: ScriptableContext<"line">) => {
        const chart = ctx.chart;
        const { ctx: canvasCtx, chartArea } = chart;
        if (!chartArea) {
          return;
        }

        const gradient = canvasCtx.createLinearGradient(
          0,
          chartArea.top,
          0,
          chartArea.bottom
        );
        gradient.addColorStop(0, "rgba(67, 121, 238, 0.16)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.18)");
        return gradient;
      },
      borderColor: "rgba(67, 121, 238, 1)",
      borderWidth: 2,
      pointHoverRadius: 2,
      pointRadius: 3,
      pointBackgroundColor: "rgba(67, 121, 238, 1)",
    },
  ],
};

const options: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      enabled: true,
      backgroundColor: "rgba(72, 128, 255, 1)",
      displayColors: false,
      position: "nearest",
      yAlign: "bottom",
      callbacks: {
        title: (tooltipItem: TooltipItem<"line">[]): string => {
          return "";
        },
        label: (tooltipItem: TooltipItem<"line">): string => {
          return `${tooltipItem.raw}%`;
        },
      },
    },
    legend: {
      labels: {
        generateLabels: (chart: ChartJS): LegendItem[] => {
          const originalLabels = chart.legend?.legendItems;
          if (originalLabels) {
            return (
              originalLabels &&
              originalLabels?.map((label: LegendItem) => ({
                ...label,
                fillStyle: "transparent",
              }))
            );
          }
          return [];
        },
        font: {
          size: 12,
        },
      },
    },
    datalabels: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      max: 100,
      ticks: {
        stepSize: 20,
        callback: (val: number | string) => {
          return `${typeof val === "number" ? val : 0}%`;
        },
      },
    },
  },
};

const AreaChart: React.FC = () => {
  return (
    <div>
      <Line data={data} height={"200px"} options={options} />
    </div>
  );
};

export default AreaChart;

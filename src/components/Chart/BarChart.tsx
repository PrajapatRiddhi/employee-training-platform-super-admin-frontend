import { FC } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  defaults,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Spin } from "antd";

// Register required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

// Set global default font size
defaults.font.size = 12;

type BarChartProps = {
  data: any;
  horizontal?: boolean;
  className?: string;
  labels?: string[];
  loading?: boolean;
};

const BarChart: FC<BarChartProps> = ({
  data,
  horizontal = false,
  className,
  labels,
  loading,
}) => {
  const options = {
    indexAxis: horizontal ? "y" : ("x" as "x" | "y"),
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: " #BDBDBD",
          font: {
            family: "Nunito Sans",
            size: 12,
          },
          // grid: {
          //   display: false, // Optional: adjust or remove grid line color
          // },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false, // Optional: adjust or remove grid line color
        },
        ticks: {
          color: " #BDBDBD",
          font: {
            family: "Nunito Sans",
            size: 12,
          },
        },
      },
    },
    plugins: {
      // legend: {
      //   display: false,
      //   labels: {
      //     color: ' #BDBDBD',
      //     font: {
      //       family: 'Nunito Sans',
      //       size: 12,
      //     },
      //   },
      // },
      datalabels: {
        color: "#BDBDBD",
        font: {
          family: "Nunito Sans",
          size: 12,
          weight: "bold",
        },
        formatter: (value: number, context: any) => {
          return labels?.[context.dataIndex] ?? ""; // Use custom labels here with a default value
        },
        anchor: "end",
        align: "end",
        offset: 2,
      },
    },
  };

  return (
    <div className={`bar-chart ${className}`}>
      {loading ? (
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/*  @ts-ignore */}
          <Bar data={data} options={options} />
        </>
      )}
    </div>
  );
};

export default BarChart;

import { FC } from "react";
import { Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  defaults,
  ChartOptions,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register required components for Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

// Set global default font size
defaults.font.size = 12;

type PieChartProps = {
  data: any;
  className?: string;
  labels?: string[];
  doughnutView?: boolean;
  labelsPosition?: "top" | "bottom" | "left" | "right";
  width?: number; // Dynamic width
  height?: number; // Dynamic height
  thickness?: string; // Dynamic thickness as a percentage string
};

const PieChart: FC<PieChartProps> = ({ data, className, labels, doughnutView, labelsPosition: labelsPosition="top",
  width = 300,  // Default width 
  height = 300, // Default height 
  thickness = '50%' // Default thickness
}) => {
  // Define options with type `ChartOptions<"doughnut">`
  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 20, // Adjust this value to increase or decrease space between the doughnut and legend
      },
    },
    plugins: {
      legend: {
        display: true,
        position: labelsPosition,  // Ensure this is one of the accepted values
        labels: {
          color: '#BDBDBD',
          font: {
            family: 'Nunito Sans',
            size: 12,
          },
        },
      },
      datalabels: {
        color: '#BDBDBD',
        font: {
          family: 'Nunito Sans',
          size: 12,
          weight: 'bold',
        },
        formatter: (value: number, context: any) => `${value}%`,
        anchor: 'end',
        align: 'end',
        offset: 20,  
        padding: 5,
        borderWidth: 1,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
      },
    },
    cutout: doughnutView ? thickness  : '0%', // Toggle between Pie and Doughnut view
  };

  return (
      <div className={`pie-chart ${className}`} style={{ width: `${width}px`, height: `${height}px` }}>
      {doughnutView ? (
        <Doughnut data={data} options={options} />
      ) : (
        //@ts-ignore
        <Pie data={data} options={options} />
      )}
    </div>
  );
};

export default PieChart;

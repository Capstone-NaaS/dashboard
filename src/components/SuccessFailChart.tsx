import { getAllSuccessfulLogs } from "../utils/getAllSuccessfulLogs";
import { getAllFailedLogs } from "../utils/getAllFailedLogs";
import { ChartProps } from "../types";
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
} from "chart.js";

import { COLORS } from "../utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SuccessFailChart: React.FC<ChartProps> = ({
  logs,
  chartLabels,
  parseDates,
  datesObj,
}) => {
  // return an array of the counts of successful logs per each date
  const successCount = () => {
    let successfulLogs = getAllSuccessfulLogs(logs);
    let successfulCounts = { ...datesObj };
    return parseDates(successfulLogs, successfulCounts);
  };
  const successData = successCount();

  // return an array of the counts of all failed logs per each date
  const failedCount = () => {
    let failedLogs = getAllFailedLogs(logs);
    let failedCounts = { ...datesObj };
    return parseDates(failedLogs, failedCounts);
  };
  const failedData = failedCount();

  // data to pass to the Line Chart
  const data = {
    labels: chartLabels.length > 0 ? chartLabels : ["No Data"],
    datasets: [
      {
        label: "successful",
        data: successData,
        borderColor: COLORS.on,
      },
      {
        label: "failed",
        data: failedData,
        borderColor: COLORS.off,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        grid: {
          color: "#263859",
          // borderColor: "#DCDCDC",
        },
        ticks: {
          color: "#778899",
        },
      },
      y: {
        grid: {
          color: "#263859",
          // borderColor: "#778899",
        },
        ticks: {
          color: "#778899",
          stepSize: 1,
        },
        min: 0,
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Notification Status",
        font: {
          size: 24,
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          weight: 400,
          lineHeight: 1.5,
        },
        color: "#F3F4F6", // Optionally change the title color
      },
      legend: {
        labels: {
          color: "#778899",
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
        tension: 0,
      },
      point: {
        radius: 2,
        hoverRadius: 10,
      },
    },
    animation: {
      duration: 1000,
    },
  };

  return (
    <div
      className="SuccessFailChart"
      style={{
        border: "1px solid grey", // Box border color and thickness
        padding: "10px", // Space between the content and the border
        borderRadius: "8px", // Optional: Rounded corners
        margin: "20px", // Optional: Adds space around the border, outside of the div
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
};

export default SuccessFailChart;

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

const NotificationStatus: React.FC<ChartProps> = ({
  logs,
  chartLabels,
  parseDates,
  datesObj,
}) => {
  const successCount = () => {
    let successfulLogs = getAllSuccessfulLogs(logs);
    let successfulCounts = { ...datesObj };
    return parseDates(successfulLogs, successfulCounts);
  };
  const successData = successCount();

  const failedCount = () => {
    let failedLogs = getAllFailedLogs(logs);
    let failedCounts = { ...datesObj };
    return parseDates(failedLogs, failedCounts);
  };
  const failedData = failedCount();

  const data = {
    labels: chartLabels.length > 0 ? chartLabels : ["No Data"],
    datasets: [
      {
        label: "Successful",
        data: successData,
        borderColor: COLORS.on,
        backgroundColor: COLORS.on,
        tension: 0.5,
      },
      {
        label: "Failed",
        data: failedData,
        borderColor: COLORS.off,
        backgroundColor: COLORS.off,
        tension: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        grid: {
          color: "#263859",
        },
        ticks: {
          color: "#778899",
        },
      },
      y: {
        grid: {
          color: "#263859",
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
          family: "Open sans",
          weight: 400,
          lineHeight: 1.5,
        },
        color: "#F3F4F6",
      },
      legend: {
        labels: {
          color: "#dadbdc",
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
      className="NotificationStatus"
      style={{
        border: "2px solid grey", // Box border color and thickness
        padding: "10px", // Space between the content and the border
        borderRadius: "8px", // Optional: Rounded corners
        margin: "20px", // Optional: Adds space around the border, outside of the div
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
};

export default NotificationStatus;

import { getAllSuccessfulLogs } from "../utils/getAllSuccessfulLogs";
import { getAllFailedLogs } from "../utils/getAllFailedLogs";
import { ChartProps } from "../types/chart";
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
        borderColor: "#388E3C",
      },
      {
        label: "failed",
        data: failedData,
        borderColor: "#F44336",
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          stepSize: 1,
        },
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
        color: "#333", // Optionally change the title color
      },
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

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
import { getAllSuccessfulLogs } from "../utils/getAllSuccessfulLogs";
import { Log, ChartProps } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SuccessChannelsChart: React.FC<ChartProps> = ({
  logs,
  chartLabels,
  parseDates,
  datesObj,
}) => {
  const successfulLogs = getAllSuccessfulLogs(logs);

  // filter successful logs based on channels and dates
  const successEmailCount = () => {
    let successfulCounts = { ...datesObj };
    let emailLogs = successfulLogs.filter(
      (log: Log) => log.channel === "email"
    );
    return parseDates(emailLogs, successfulCounts);
  };
  const emailData = successEmailCount();

  const successInAppCount = () => {
    let successfulCounts = { ...datesObj };
    let inappLogs = successfulLogs.filter(
      (log: Log) => log.channel === "in_app"
    );
    return parseDates(inappLogs, successfulCounts);
  };
  const inappData = successInAppCount();

  // data to pass to the Line Chart
  const data = {
    labels: chartLabels.length > 0 ? chartLabels : ["No Data"],
    datasets: [
      {
        label: "in_app",
        data: inappData,
        borderColor: "#3F51B5",
      },
      {
        label: "email",
        data: emailData,
        borderColor: "#FEBE10",
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
        min: 0,
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Successful Outgoing Channels",
        font: {
          size: 24,
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          weight: 400,
          lineHeight: 1.5,
        },
        color: "#333",
      },
    },
  };

  return (
    <div
      className="SuccessChannelsChart"
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

export default SuccessChannelsChart;

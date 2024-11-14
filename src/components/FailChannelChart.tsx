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
import { getAllFailedLogs } from "../utils/getAllFailedLogs";
import { Log, ChartProps } from "../types/chart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FailChannelsChart: React.FC<ChartProps> = ({
  logs,
  chartLabels,
  parseDates,
  datesObj,
}) => {
  const failedLogs = getAllFailedLogs(logs);

  // filter failed logs based on channels and dates
  const failEmailCount = () => {
    let failedCounts = { ...datesObj };
    let emailLogs = failedLogs.filter((log: Log) => log.channel === "email");
    return parseDates(emailLogs, failedCounts);
  };
  const emailData = failEmailCount();

  const failInAppCount = () => {
    let failedCounts = { ...datesObj };
    let inappLogs = failedLogs.filter((log: Log) => log.channel === "in_app");
    return parseDates(inappLogs, failedCounts);
  };
  const inappData = failInAppCount();

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
        text: "Failed Outgoing Channels",
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

export default FailChannelsChart;

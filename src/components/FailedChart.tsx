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

const FailedChart: React.FC<ChartProps> = ({
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

  const failSlackCount = () => {
    let failedCounts = { ...datesObj };
    let slackLogs = failedLogs.filter((log: Log) => log.channel === "slack");
    return parseDates(slackLogs, failedCounts);
  };
  const slackData = failSlackCount();

  // data to pass to the Line Chart
  const data = {
    labels: chartLabels.length > 0 ? chartLabels : ["No Data"],
    datasets: [
      {
        label: "In-app",
        data: inappData,
        backgroundColor: "#E0A910",
        borderColor: "#E0A910",
        tension: 0.5,
      },
      {
        label: "Email",
        data: emailData,
        backgroundColor: "#f8e5a4",
        borderColor: "#f8e5a4",
        tension: 0.5,
      },
      {
        label: "Slack",
        data: slackData,
        backgroundColor: "#FFFFF0",
        borderColor: "#FFFFF0",
        tension: 0.5,
      },
    ],
  };

  // Chart options
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
        text: "Failed Outgoing Channels",
        font: {
          size: 24,
          family: "Open Sans",
          weight: 400,
          lineHeight: 1.5,
        },
        color: "#F3F4F6", // Optionally change the title color
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
      className="SuccessfulChart"
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

export default FailedChart;

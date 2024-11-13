import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SuccessChannelsChart = ({ logs, chartLabels, parseDates, datesObj }) => {
  // return an array of all the "successful" logs
  const getAllSuccess = () => {
    const successDates = logs.filter((log) => {
      if (
        log.status === "Email sent" ||
        log.status === "Notification queued for sending"
      ) {
        return log;
      }
    });
    return successDates;
  };

  // filter successful logs based on channels and dates
  const successEmailCount = () => {
    const successfulLogs = getAllSuccess();
    let successfulCounts = { ...datesObj };
    let emailLogs = successfulLogs.filter((log) => log.channel === "email");
    return parseDates(emailLogs, successfulCounts);
  };
  const emailData = successEmailCount();

  const successInAppCount = () => {
    const successfulLogs = getAllSuccess();
    let successfulCounts = { ...datesObj };
    let inappLogs = successfulLogs.filter((log) => log.channel === "in-app");
    return parseDates(inappLogs, successfulCounts);
  };
  const inappData = successInAppCount();

  // data to pass to the Line Chart
  const data = {
    labels: chartLabels.length > 0 ? chartLabels : ["No Data"],
    datasets: [
      {
        label: "in-app",
        data: inappData,
        backgroundColor: "#81D4FA",
      },
      {
        label: "email",
        data: emailData,
        backgroundColor: "#0288D1",
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
        text: "Successful Outgoing Channels",
        font: {
          size: 24, // Set the font size of the title (in pixels)
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", // Optionally specify a font family
          weight: "bold", // Set the font weight (optional)
          lineHeight: 1.5, // Line height (optional)
        },
        color: "#333", // Optionally change the title color
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
      <Bar data={data} options={options} />
    </div>
  );
};

export default SuccessChannelsChart;

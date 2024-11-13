import SuccessFailChart from "./SuccessFailChart";
import SuccessChannelsChart from "./SuccessChannelsChart";
import FailChannelsChart from "./FailChannelChart";
import { useState, useEffect } from "react";

import BackendSDK from "./../../../backend-sdk/src/index.ts";
const apiUrl = import.meta.env.VITE_HTTP_GATEWAY;
const naas = new BackendSDK("secretkey1", apiUrl!);

const MONTHS = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

function parseDates(arr, dateObj) {
  arr.map((log) => {
    const date = new Date(log.created_at);
    const month = MONTHS[date.getMonth() + 1];
    const day = date.getDate();

    dateObj[`${month}-${day}`] += 1;
  });
  return Object.values(dateObj);
}

const AnalyticsChart = () => {
  const [logs, setLogs] = useState([]);

  const xAxisDates = () => {
    const created_at = logs.map((log) => {
      const date = new Date(log.created_at);
      const month = MONTHS[date.getMonth() + 1];
      const day = date.getDate();

      return `${month}-${day}`;
    });
    const sortedDates = created_at.sort((a, b) => {
      const [monthA, dayA] = a.split("-");
      const [monthB, dayB] = b.split("-");

      if (parseInt(dayA) !== parseInt(dayB)) {
        return parseInt(dayA) - parseInt(dayB);
      }

      return (
        Object.values(MONTHS).indexOf(monthA) -
        Object.values(MONTHS).indexOf(monthB)
      );
    });

    const uniqueDates = [];
    sortedDates.forEach((date) => {
      if (!uniqueDates.includes(date)) {
        uniqueDates.push(date);
      }
    });
    return uniqueDates;
  };
  const chartLabels = xAxisDates();

  const datesObj = chartLabels.reduce((acc, curr) => {
    acc[curr] = 0;
    return acc;
  }, {});

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        console.log("fetching logs...");
        const fetchedLogs = await naas.getNotificationLogs();
        setLogs(fetchedLogs);
      } catch (error) {
        console.error("Error fetching logs: ", error);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div
      className="Analytics"
      style={{
        width: "80%",
        maxWidth: "1200px",
        margin: "auto",
      }}
    >
      <SuccessFailChart
        logs={logs}
        chartLabels={chartLabels}
        parseDates={parseDates}
        datesObj={datesObj}
      />
      <SuccessChannelsChart
        logs={logs}
        chartLabels={chartLabels}
        parseDates={parseDates}
        datesObj={datesObj}
      />
      <FailChannelsChart
        logs={logs}
        chartLabels={chartLabels}
        parseDates={parseDates}
        datesObj={datesObj}
      />
    </div>
  );
};

export default AnalyticsChart;

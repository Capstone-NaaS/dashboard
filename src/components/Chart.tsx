import SuccessFailChart from "./SuccessFailChart";
import SuccessChannelsChart from "./SuccessChannelsChart";
import FailChannelsChart from "./FailChannelChart";
import { useState, useEffect } from "react";
import { Log, DateValues } from "../types";

const MONTHS: { [key: string]: string } = {
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

function parseDates(arr: Log[], dateObj: DateValues) {
  arr.map((log: Log) => {
    const date = new Date(log.created_at);
    const month = MONTHS[(date.getMonth() + 1).toString()];
    const day = date.getDate();

    dateObj[`${month}-${day}`] += 1;
  });
  return Object.values(dateObj);
}

const AnalyticsChart = () => {
  const [logs, setLogs] = useState([]);

  const xAxisDates = () => {
    const created_at = logs.map((log: Log) => {
      const date = new Date(log.created_at);
      const month = MONTHS[(date.getMonth() + 1).toString()];
      const day = date.getDate();

      return { month, day, fullDate: `${month}-${day}` };
    });
    const sortedDates = created_at
      .sort((a, b) => {
        const monthIndexA = Object.values(MONTHS).indexOf(a.month);
        const monthIndexB = Object.values(MONTHS).indexOf(b.month);

        if (monthIndexA !== monthIndexB) {
          return monthIndexA - monthIndexB;
        }

        return a.day - b.day;
      })
      .map((log) => log.fullDate);

    const uniqueDates: Array<string> = [];
    sortedDates.forEach((date) => {
      if (!uniqueDates.includes(date)) {
        uniqueDates.push(date);
      }
    });
    return uniqueDates;
  };
  const chartLabels = xAxisDates();

  const datesObj = chartLabels.reduce((acc: DateValues, curr) => {
    acc[curr] = 0;
    return acc;
  }, {});

  useEffect(() => {
    const getNotificationLogs = async () => {
      try {
        const apiUrl = import.meta.env.VITE_HTTP_GATEWAY;
        const apiSecret = import.meta.env.VITE_API_KEY;

        const url = apiUrl + `/notifications`;

        let response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: apiSecret,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const fetchedLogs = await response.json();
        setLogs(fetchedLogs);
      } catch (error) {
        console.log("Error fetching notification logs", error);
      }
    };

    getNotificationLogs();
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

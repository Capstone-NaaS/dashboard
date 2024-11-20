import { Log } from "../types";
// return an array of all the "successful" logs
export const getAllSuccessfulLogs = (logs: Log[]) => {
  const successDates = logs.filter(
    (log) =>
      log.status === "Email sent." ||
      log.status === "Notification sent." ||
      log.status === "Slack notification sent."
  );
  return successDates;
};

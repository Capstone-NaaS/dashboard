import { Log } from "../types";
// return an array of all the "failed" logs
export const getAllFailedLogs = (logs: Log[]) => {
  const failedDates = logs.filter(
    (log) =>
      log.status === "Email could not be sent: SES failure." ||
      log.status === "In-app notification unable to be broadcast." ||
      log.status === "Slack notification could not be sent." ||
      log.status === "Error sending email." ||
      log.status === "Error sending Slack notification."
  );
  return failedDates;
};

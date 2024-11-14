import { Logs } from "../types/chart";
// return an array of all the "successful" logs
export const getAllSuccessfulLogs = (logs: Logs) => {
  const successDates = logs.filter(
    (log) =>
      log.status === "Email sent." ||
      log.status === "Notification queued for sending."
  );
  return successDates;
};

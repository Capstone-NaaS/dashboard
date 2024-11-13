// return an array of all the "failed" logs
export const getAllFailedLogs = (logs) => {
  const failedDates = logs.filter(
    (log) =>
      log.status === "Email could not be sent." ||
      log.status === "Notification unable to be broadcast."
  );
  return failedDates;
};

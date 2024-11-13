// return an array of all the "successful" logs
export const getAllSuccessfulLogs = (logs) => {
  const successDates = logs.filter(
    (log) =>
      log.status === "Email sent." ||
      log.status === "Notification queued for sending."
  );
  return successDates;
};

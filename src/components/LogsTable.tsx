import { Table, Badge } from "flowbite-react";

function LogsTable({ logs }) {
  function sortAndFilterLogs(logs) {
    logs = JSON.parse(JSON.stringify(logs)); // deep copy

    // sort the logs to group by created_at most recent to least recent log
    logs.sort((logA, logB) => {
      const dateA = new Date(logA.created_at);
      const dateB = new Date(logB.created_at);

      if (dateA > dateB) {
        // date A came after date B
        return -1;
      } else if (dateA < dateB) {
        return 1;
      } else {
        return 0;
      }
    });

    let mostRecent = [];
    let prevNotifId;

    for (let index = 0; index < logs.length; index++) {
      let log = logs[index];

      if (log.notification_id === prevNotifId) {
        continue;
      }

      // if there is no log with a matching notification_id, add to most recent array
      let match = !!mostRecent.find(
        (obj) => obj.notification_id === log.notification_id
      );

      if (!match) {
        mostRecent.push(log);
        prevNotifId = log.notification_id;
      }
    }

    return mostRecent;
  }

  function formatDate(isoString) {
    const date = new Date(isoString);

    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return formattedDate;
  }

  function getBadge(log) {
    let badgeColor;

    if (log.status.includes("received")) {
      badgeColor = "success";
    } else if (log.status.includes("pref")) {
      badgeColor = "info";
    } else if (log.status.includes("failed")) {
      badgeColor = "failure";
    }

    return (
      <div className="flex flex-wrap gap-2">
        <Badge color={badgeColor}>{log.status}</Badge>
      </div>
    );
  }
  const tableData = sortAndFilterLogs(logs);

  return (
    <div className="overflow-x-auto flex-grow">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Recipient</Table.HeadCell>
          <Table.HeadCell>Channel</Table.HeadCell>
          <Table.HeadCell>Message</Table.HeadCell>
          <Table.HeadCell>Date</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {tableData.map((log) => {
            return (
              <Table.Row
                key={log.log_id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {getBadge(log)}
                </Table.Cell>
                <Table.Cell>User {log.user_id}</Table.Cell>
                <Table.Cell>{log.channel}</Table.Cell>
                <Table.Cell>{log.message}</Table.Cell>
                <Table.Cell>{formatDate(log.created_at)}</Table.Cell>
                <Table.Cell>
                  <a href="#" className="font-medium hover:underline">
                    Log Details
                  </a>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}

export default LogsTable;

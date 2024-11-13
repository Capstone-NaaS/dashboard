import { useEffect, useState } from "react";
import { Table, Badge, Drawer } from "flowbite-react";

interface Log {
  user_id: string;
  created_at: string;
  status: string;
  notification_id: string;
  log_id: string;
  ttl: number;
  message: string;
}

interface InAppNotificationLog extends Log {
  channel: "in_app";
}

interface EmailNotificationLog extends Log {
  subject: string;
  receiver_email: string;
  channel: "email";
}

function LogsTable() {
  const [logs, setLogs] = useState<
    (InAppNotificationLog | EmailNotificationLog)[]
  >([]);
  const [selectedLog, setSelectedLog] = useState<
    InAppNotificationLog | EmailNotificationLog | undefined
  >();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = (log: InAppNotificationLog | EmailNotificationLog) => {
    setSelectedLog(log);
    setIsOpen(true);
  };

  const handleClose = () => {
    setSelectedLog(undefined); // what to do here for removing selected log
    setIsOpen(false);
  };

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
        return { status: 500, body: "Internal Server Error" };
      }
    };

    getNotificationLogs();
  }, []);

  function sortAndFilterLogs(
    logs: (InAppNotificationLog | EmailNotificationLog)[]
  ) {
    logs = JSON.parse(JSON.stringify(logs));

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

  function formatDate(isoString: string) {
    const date = new Date(isoString);

    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return formattedDate;
  }

  function getBadge(log: InAppNotificationLog | EmailNotificationLog) {
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
                <Table.Cell onClick={() => handleOpen(log)}>
                  <p className="font-medium hover:underline">Log Details</p>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      {selectedLog ? (
        <Drawer
          className="w-3/4"
          open={isOpen}
          onClose={() => handleClose()}
          position="right"
        >
          <Drawer.Header
            title={`Associated Notification Logs: ${selectedLog.log_id}`}
            titleIcon={() => <></>}
          />
          <Drawer.Items>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Recipient</Table.HeadCell>
                <Table.HeadCell>Channel</Table.HeadCell>
                <Table.HeadCell>Message</Table.HeadCell>
                <Table.HeadCell>Date</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {logs
                  .filter(
                    (log) =>
                      log.notification_id === selectedLog.notification_id &&
                      log.log_id !== selectedLog.log_id
                  )
                  .map((log) => {
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
                      </Table.Row>
                    );
                  })}
              </Table.Body>
            </Table>
          </Drawer.Items>
        </Drawer>
      ) : null}
    </div>
  );
}

export default LogsTable;

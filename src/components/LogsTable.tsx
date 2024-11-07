import { Table, Badge } from "flowbite-react";

const MOCK_LOG = {
  id: 11,
  recipient: "Frances",
  created_at: "Wed, 30 Oct 2024 23:26:20 GMT",
  channel: "in-app",
  log_id: "fcf86d0f-8fcd-49a9-a61d-343ea5761a36",
  message: "You have a new comment!",
  notification_id: "4b820132-7e16-43db-9347-c0e9dac5bc5f",
  status: "notification failed",
};

/*
when a particular log is selected, this table will display
with the log's details.

How can I pass the specific log details from the LogSidebar
to this component?
*/

function LogsTable({ logs }) {
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

  return (
    <div className="overflow-x-auto flex-grow">
      <Table>
        <Table.Head>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Recipient</Table.HeadCell>
          <Table.HeadCell>Channel</Table.HeadCell>
          <Table.HeadCell>Message</Table.HeadCell>
          <Table.HeadCell>Date</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {logs.map((log) => {
            return (
              <Table.Row
                key={log.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {getBadge(log)}
                </Table.Cell>
                <Table.Cell>User {log.user_id}</Table.Cell>
                <Table.Cell>{log.channel}</Table.Cell>
                <Table.Cell>{log.message}</Table.Cell>
                <Table.Cell>{log.created_at}</Table.Cell>
              </Table.Row>
            );
          })}
          <Table.Row
            key={MOCK_LOG.id}
            className="bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {getBadge(MOCK_LOG)}
            </Table.Cell>
            <Table.Cell>User {MOCK_LOG.user_id}</Table.Cell>
            <Table.Cell>{MOCK_LOG.channel}</Table.Cell>
            <Table.Cell>{MOCK_LOG.message}</Table.Cell>
            <Table.Cell>{MOCK_LOG.created_at}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
}

export default LogsTable;

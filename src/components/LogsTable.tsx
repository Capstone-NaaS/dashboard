import { Table, Badge } from "flowbite-react";

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
      <Table hoverable>
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
                key={log.log_id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {getBadge(log)}
                </Table.Cell>
                <Table.Cell>User {log.user_id}</Table.Cell>
                <Table.Cell>{log.channel}</Table.Cell>
                <Table.Cell>{log.message}</Table.Cell>
                <Table.Cell>{log.created_at}</Table.Cell>
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

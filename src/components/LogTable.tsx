import { Table } from "flowbite-react";

const MOCK_LOG = {
  user_id: 1,
  recipient: "Erin Olson",
  created_at: "Wed, 30 Oct 2024 23:26:20 GMT",
  channel: "in-app",
  log_id: "fcf86d0f-8fcd-49a9-a61d-343ea5761a36",
  message: "User 1 has logged in",
  notification_id: "4b820132-7e16-43db-9347-c0e9dac5bc5f",
  status: "notification request received",
};

function LogTable() {
  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Recipient</Table.HeadCell>
          <Table.HeadCell>Channel</Table.HeadCell>
          <Table.HeadCell>Message</Table.HeadCell>
          <Table.HeadCell>Date</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {MOCK_LOG.status}
            </Table.Cell>
            <Table.Cell>{MOCK_LOG.recipient}</Table.Cell>
            <Table.Cell>{MOCK_LOG.channel}</Table.Cell>
            <Table.Cell>{MOCK_LOG.message}</Table.Cell>
            <Table.Cell>{MOCK_LOG.created_at}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
}

export default LogTable;

import { Table } from "flowbite-react";

function DlqTable({ logs }) {
  return (
    <div className="overflow-x-auto flex-grow">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>ID</Table.HeadCell>
          <Table.HeadCell>Recipient</Table.HeadCell>
          <Table.HeadCell>Message</Table.HeadCell>
          <Table.HeadCell>Channel</Table.HeadCell>
          <Table.HeadCell>Subject</Table.HeadCell>
          <Table.HeadCell>Receiver Email</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {logs.map((log) => (
            <Table.Row
              key={log.notification_id}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell>{log.notification_id}</Table.Cell>
              <Table.Cell>{log.user_id}</Table.Cell>
              <Table.Cell>{log.body.message}</Table.Cell>
              <Table.Cell>{log.channel}</Table.Cell>
              <Table.Cell>{log.body.subject}</Table.Cell>
              <Table.Cell>{log.body.receiver_email}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default DlqTable;

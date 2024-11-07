"use client";

import { Table } from "flowbite-react";

function UsersTable({ logs }) {
  return (
    <div className="overflow-x-auto flex-grow">
      <Table>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Created At</Table.HeadCell>
          <Table.HeadCell>Last Seen</Table.HeadCell>
          <Table.HeadCell>Last Notified</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {logs.map((user) => {
            return (
              <Table.Row
                key={user.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.created_at}</Table.Cell>
                <Table.Cell>{user.last_seen}</Table.Cell>
                <Table.Cell>{user.last_notified}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}

export default UsersTable;

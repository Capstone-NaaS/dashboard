"use client";
import { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import BackendSDK from "../../../backend-sdk/src/index.ts";

const apiUrl = import.meta.env.VITE_HTTP_GATEWAY;
const naas = new BackendSDK("secretkey1", apiUrl!);

function UsersTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("fetching users...");
        const fetchedUsers = await naas.getAllUsers();
        setUsers(fetchedUsers.message);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

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
          {users.map((user) => {
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

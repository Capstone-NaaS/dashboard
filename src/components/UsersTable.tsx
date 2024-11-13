"use client";
import { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import formatDate from "../utils/formatDate";

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  last_seen: string;
  last_notified: string;
}

function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const apiUrl = import.meta.env.VITE_HTTP_GATEWAY;
        const apiSecret = import.meta.env.VITE_API_KEY;

        const url = apiUrl + `/users`;

        let response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: apiSecret,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const fetchedUsers = await response.json();
        setUsers(fetchedUsers);
      } catch (error) {
        console.log("Error fetching users", error);
      }
    };

    getAllUsers();
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
                <Table.Cell>{formatDate(user.last_seen)}</Table.Cell>
                <Table.Cell>{formatDate(user.last_notified)}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}

export default UsersTable;

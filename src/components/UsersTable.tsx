"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Table, TextInput, Label, Spinner } from "flowbite-react";
import formatDate from "../utils/formatDate";
import { User } from "../types/index";

function UsersTable() {
  const [searchParams] = useSearchParams();
  const initialIdFilter = searchParams.get("id") || "";
  const initialEmailFilter = searchParams.get("email") || "";

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [idFilter, setIdFilter] = useState(initialIdFilter);
  const [emailFilter, setEmailFilter] = useState(initialEmailFilter);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const apiUrl = import.meta.env.VITE_HTTP_GATEWAY;
        const apiSecret = import.meta.env.VITE_API_KEY;
        const url = apiUrl + `/users`;

        const response = await fetch(url, {
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
        setFilteredUsers(fetchedUsers);
      } catch (error) {
        console.log("Error fetching users", error);
      } finally {
        setLoading(false);
      }
    };

    getAllUsers();
  }, []);

  useEffect(() => {
    const newFilteredUsers = users.filter((user) => {
      const matchesId = user.id.toLowerCase().includes(idFilter.toLowerCase());
      const matchesEmail = user.email
        .toLowerCase()
        .includes(emailFilter.toLowerCase());
      return matchesId && matchesEmail;
    });
    setFilteredUsers(newFilteredUsers);
  }, [users, idFilter, emailFilter]);

  return (
    <div className="overflow-x-auto w-full">
      <div className="flex flex-wrap gap-4 p-4 border-b">
        <div className="flex flex-col">
          <Label htmlFor="idFilter">Filter by User ID</Label>
          <TextInput
            id="idFilter"
            placeholder="Enter user ID"
            value={idFilter}
            onChange={(e) => setIdFilter(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="emailFilter">Filter by Email</Label>
          <TextInput
            id="emailFilter"
            placeholder="Enter user email"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto flex-grow">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Spinner aria-label="Loading" size="xl" className="text-gray-500" />
            <span className="ml-3 text-gray-500">Loading users...</span>
          </div>
        ) : (
          <Table>
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Created At</Table.HeadCell>
              <Table.HeadCell>Last Seen</Table.HeadCell>
              <Table.HeadCell>Last Notified</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <Table.Row
                    key={user.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{formatDate(user.created_at)}</Table.Cell>
                    <Table.Cell>{formatDate(user.last_seen)}</Table.Cell>
                    <Table.Cell>{formatDate(user.last_notified)}</Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell
                    colSpan={5}
                    className="text-center p-4 text-gray-500"
                  >
                    No users to display.
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        )}
      </div>
    </div>
  );
}

export default UsersTable;

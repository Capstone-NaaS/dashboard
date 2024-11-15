"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Table, TextInput, Label, Spinner, Button } from "flowbite-react";
import formatDate from "../utils/formatDate";
import { User } from "../types/index";
import { CiBellOn } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { FaSortUp, FaSortDown } from "react-icons/fa";

function UsersTable() {
  const [searchParams] = useSearchParams();
  const initialIdFilter = searchParams.get("id") || "";
  const initialEmailFilter = searchParams.get("email") || "";

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [idFilter, setIdFilter] = useState(initialIdFilter);
  const [emailFilter, setEmailFilter] = useState(initialEmailFilter);
  const [inAppFilter, setInAppFilter] = useState(false);
  const [emailPrefFilter, setEmailPrefFilter] = useState(false);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [filterActive, setFilterActive] = useState<boolean>(false);

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
      const matchesInAppPref = user.preferences.in_app === inAppFilter;
      const matchesEmailPref = user.preferences.email === emailPrefFilter;

      return matchesId && matchesEmail && matchesInAppPref && matchesEmailPref;
    });
    setFilteredUsers(newFilteredUsers);
  }, [users, idFilter, emailFilter, inAppFilter, emailPrefFilter]);

  const handleSort = (column: "created_at" | "last_seen" | "last_notified") => {
    let newSortOrder: "asc" | "desc" | null;
    if (sortColumn === column) {
      newSortOrder =
        sortOrder === "asc" ? "desc" : sortOrder === "desc" ? null : "asc";
    } else {
      newSortOrder = "asc";
    }

    setSortColumn(column);
    setSortOrder(newSortOrder);

    if (newSortOrder) {
      setFilteredUsers((prevUsers) =>
        [...prevUsers].sort((a, b) => {
          const aVal = a[column] || "";
          const bVal = b[column] || "";
          if (newSortOrder === "asc") return aVal > bVal ? 1 : -1;
          return aVal < bVal ? 1 : -1;
        })
      );
    } else {
      setFilteredUsers([...users]);
    }
  };

  const generateUserRow = (user: User) => {
    return (
      <Table.Row
        key={user.id}
        className="bg-white dark:border-gray-700 dark:bg-gray-800"
      >
        <Table.Cell>{user.id}</Table.Cell>
        <Table.Cell>{user.name}</Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell>{formatDate(user.created_at)}</Table.Cell>
        <Table.Cell>{formatDate(user.last_seen)}</Table.Cell>
        <Table.Cell>{formatDate(user.last_notified)}</Table.Cell>
        <Table.Cell>
          <div className="flex space-x-2">
            <CiBellOn
              size={24}
              color={user.preferences.in_app ? "#1E90FF" : "#B0C4DE"}
            />
            <MdOutlineEmail
              size={24}
              color={user.preferences.email ? "#1E90FF" : "#B0C4DE"}
            />
          </div>
        </Table.Cell>
      </Table.Row>
    );
  };

  const generateRows = (users: User[]) => {
    if (users.length === 0) {
      return (
        <Table.Row>
          <Table.Cell colSpan={6} className="text-center p-4 text-gray-500">
            No users to display.
          </Table.Cell>
        </Table.Row>
      );
    } else {
      return users.map(generateUserRow);
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <div className="flex flex-wrap gap-4 p-4 border-b">
        <div className="flex flex-col">
          <Label htmlFor="idFilter">Filter by User ID</Label>
          <TextInput
            id="idFilter"
            placeholder="Enter user ID"
            value={idFilter}
            onChange={(e) => {
              setFilterActive(true);
              setIdFilter(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="emailFilter">Filter by Email</Label>
          <TextInput
            id="emailFilter"
            placeholder="Enter user email"
            value={emailFilter}
            onChange={(e) => {
              setFilterActive(true);
              setEmailFilter(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col">
          <Label className="mb-2">Filter by Preferences</Label>
          <div className="flex space-x-2">
            <CiBellOn
              size={24}
              color={inAppFilter ? "#1E90FF" : "#B0C4DE"}
              onClick={() => {
                setFilterActive(true);
                setInAppFilter(!inAppFilter);
              }}
              className="cursor-pointer"
            />
            <MdOutlineEmail
              size={24}
              color={emailPrefFilter ? "#1E90FF" : "#B0C4DE"}
              onClick={() => {
                setFilterActive(true);
                setEmailPrefFilter(!emailPrefFilter);
              }}
              className="cursor-pointer"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <Label className="mb-2">Remove Filters</Label>
          <div className="flex space-x-2">
            <Button
              pill
              size="xs"
              color="purple"
              as="span"
              className="cursor-pointer"
              onClick={() => {
                setIdFilter("");
                setEmailFilter("");
                setInAppFilter(false);
                setEmailPrefFilter(false);
                setFilterActive(false);
              }}
            >
              Reset
            </Button>
          </div>
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
              <Table.HeadCell>User ID</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell
                onClick={() => handleSort("created_at")}
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  Created At{" "}
                  {sortColumn === "created_at" &&
                    (sortOrder === "asc" ? (
                      <FaSortUp className="ml-2" />
                    ) : sortOrder === "desc" ? (
                      <FaSortDown className="ml-2" />
                    ) : null)}
                </div>
              </Table.HeadCell>

              <Table.HeadCell
                onClick={() => handleSort("last_seen")}
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  Last Seen{" "}
                  {sortColumn === "last_seen" &&
                    (sortOrder === "asc" ? (
                      <FaSortUp className="ml-2" />
                    ) : sortOrder === "desc" ? (
                      <FaSortDown className="ml-2" />
                    ) : null)}
                </div>
              </Table.HeadCell>

              <Table.HeadCell
                onClick={() => handleSort("last_notified")}
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  Last Notified{" "}
                  {sortColumn === "last_notified" &&
                    (sortOrder === "asc" ? (
                      <FaSortUp className="ml-2" />
                    ) : sortOrder === "desc" ? (
                      <FaSortDown className="ml-2" />
                    ) : null)}
                </div>
              </Table.HeadCell>
              <Table.HeadCell>Preferences</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {!filterActive
                ? generateRows(users) // filter not active gen rows for all users
                : generateRows(filteredUsers)}
            </Table.Body>
          </Table>
        )}
      </div>
    </div>
  );
}

export default UsersTable;

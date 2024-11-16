"use client";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Table, TextInput, Label, Spinner, Button } from "flowbite-react";
import formatDate from "../utils/formatDate";
import { User } from "../types/index";
import { FaRegBell } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { COLORS } from "../utils";

const FILTER_STATES = {
  ALL: "all",
  ON: "on",
  OFF: "off",
} as const;

type FilterState = (typeof FILTER_STATES)[keyof typeof FILTER_STATES];

function UsersTable() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const initialIdFilter = searchParams.get("id") || "";
  const initialEmailFilter = searchParams.get("email") || "";

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [idFilter, setIdFilter] = useState(initialIdFilter);
  const [emailFilter, setEmailFilter] = useState(initialEmailFilter);
  const [inAppFilter, setInAppFilter] = useState<FilterState>(
    FILTER_STATES.ALL
  );
  const [emailPrefFilter, setEmailPrefFilter] = useState<FilterState>(
    FILTER_STATES.ALL
  );
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

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

  const handleToggle = (
    filterSetter: (value: React.SetStateAction<FilterState>) => void
  ) => {
    filterSetter((prev) =>
      prev === FILTER_STATES.ALL
        ? FILTER_STATES.ON
        : prev === FILTER_STATES.ON
        ? FILTER_STATES.OFF
        : FILTER_STATES.ALL
    );
  };

  useEffect(() => {
    const applyFilters = () => {
      setFilteredUsers(
        users.filter((user) => {
          const matchesId = user.id
            .toLowerCase()
            .includes(idFilter.toLowerCase());
          const matchesEmail = user.email
            .toLowerCase()
            .includes(emailFilter.toLowerCase());

          const matchesInAppPref =
            inAppFilter === FILTER_STATES.ALL ||
            (inAppFilter === FILTER_STATES.ON && user.preferences.in_app) ||
            (inAppFilter === FILTER_STATES.OFF && !user.preferences.in_app);

          const matchesEmailPref =
            emailPrefFilter === FILTER_STATES.ALL ||
            (emailPrefFilter === FILTER_STATES.ON && user.preferences.email) ||
            (emailPrefFilter === FILTER_STATES.OFF && !user.preferences.email);

          return (
            matchesId && matchesEmail && matchesInAppPref && matchesEmailPref
          );
        })
      );
    };

    applyFilters();
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
          const aVal = a[column];
          const bVal = b[column];

          if (aVal === undefined && bVal === undefined) return 0;
          if (aVal === undefined) return 1;
          if (bVal === undefined) return -1;

          const dateA = new Date(aVal);
          const dateB = new Date(bVal);

          if (newSortOrder === "asc") {
            return dateA > dateB ? 1 : dateA < dateB ? -1 : 0;
          } else {
            return dateA < dateB ? 1 : dateA > dateB ? -1 : 0;
          }
        })
      );
    } else {
      setFilteredUsers((prevUsers) => [...prevUsers]);
    }
  };

  const generateUserRow = (user: User) => {
    return (
      <Table.Row
        key={user.id}
        className="dark:border-gray-700 dark:bg-gray-800 hover:bg-[#6B778D]"
      >
        <Table.Cell>{user.id}</Table.Cell>
        <Table.Cell>{user.name}</Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell>{formatDate(user.created_at)}</Table.Cell>
        <Table.Cell>{formatDate(user.last_seen)}</Table.Cell>
        <Table.Cell>{formatDate(user.last_notified)}</Table.Cell>
        <Table.Cell>
          <div className="flex space-x-2">
            <FaRegBell
              size={24}
              color={user.preferences.in_app ? COLORS.on : COLORS.off}
            />
            <MdOutlineEmail
              size={24}
              color={user.preferences.email ? COLORS.on : COLORS.off}
            />
          </div>
        </Table.Cell>
        <Table.Cell>
          <span
            onClick={() => navigate(`/notification-logs?userid=${user.id}`)}
            className="font-medium hover:underline"
            style={{ cursor: "pointer" }}
          >
            Get Logs
          </span>
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
        <div className="flex flex-col transform translate-y-[-8px]">
          <TextInput
            style={{ background: "#233142", color: "#F3F4F5" }}
            id="idFilter"
            placeholder="Enter user ID"
            value={idFilter}
            onChange={(e) => {
              setIdFilter(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col transform translate-y-[-8px]">
          <TextInput
            style={{ background: "#233142", color: "#F3F4F5" }}
            id="emailFilter"
            placeholder="Enter user email"
            value={emailFilter}
            onChange={(e) => {
              setEmailFilter(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex space-x-4">
            <FaRegBell
              color={COLORS[inAppFilter]}
              size={24}
              onClick={() => handleToggle(setInAppFilter)}
              className={"cursor-pointer"}
            />
            <MdOutlineEmail
              color={COLORS[emailPrefFilter]}
              size={24}
              onClick={() => handleToggle(setEmailPrefFilter)}
              className={"cursor-pointer"}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex space-x-2 tranform translate-y-[-3px]">
            <Button
              pill
              size="xs"
              color={COLORS.button}
              as="span"
              className="cursor-pointer"
              onClick={() => {
                setIdFilter("");
                setEmailFilter("");
                setInAppFilter(FILTER_STATES.ALL);
                setEmailPrefFilter(FILTER_STATES.ALL);
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
              <Table.HeadCell className="bg-[#233142]">User ID</Table.HeadCell>
              <Table.HeadCell className="bg-[#233142]">Name</Table.HeadCell>
              <Table.HeadCell className="bg-[#233142]">Email</Table.HeadCell>
              <Table.HeadCell
                onClick={() => handleSort("created_at")}
                className="cursor-pointer bg-[#233142]"
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
                className="cursor-pointer bg-[#233142]"
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
                className="cursor-pointer bg-[#233142]"
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
              <Table.HeadCell className="bg-[#233142]">
                Preferences
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#233142]"></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {generateRows(filteredUsers)}
            </Table.Body>
          </Table>
        )}
      </div>
    </div>
  );
}

export default UsersTable;

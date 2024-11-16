import { Table, TextInput, Label, Spinner, Button } from "flowbite-react";
import { deadLog } from "../types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegBell } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

import { fetchDlq, COLORS } from "../utils";

const FILTER_STATES = {
  ON: "on",
  EXCLUDE: "exclude",
} as const;

type FilterState = (typeof FILTER_STATES)[keyof typeof FILTER_STATES];

interface DlqTableProps {
  deadLogs: deadLog[];
  setDeadLogs: React.Dispatch<React.SetStateAction<deadLog[]>>;
  loadingDLQ: boolean;
  setLoadingDLQ: React.Dispatch<React.SetStateAction<boolean>>;
}

function DlqTable({
  deadLogs,
  setDeadLogs,
  loadingDLQ,
  setLoadingDLQ,
}: DlqTableProps) {
  const navigate = useNavigate();

  const [filteredLogs, setFilteredLogs] = useState<deadLog[]>([]);
  const [userIdFilter, setUserIdFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [inAppFilter, setInAppFilter] = useState<FilterState>("on");
  const [emailChannelFilter, setEmailChannelFilter] =
    useState<FilterState>("on");

  useEffect(() => {
    setLoadingDLQ(true);
    (async () => {
      await fetchDlq(setDeadLogs);
      setLoadingDLQ(false);
    })();
  }, []);

  useEffect(() => {
    if (loadingDLQ) return;

    const newFilteredLogs = deadLogs.filter((log) => {
      const matchesUserId = log.user_id
        .toLowerCase()
        .includes(userIdFilter.toLowerCase());
      const matchesEmail = (log.body.receiver_email || "")
        .toLowerCase()
        .includes(emailFilter.toLowerCase());
      const matchesChannel =
        (inAppFilter === FILTER_STATES.ON && log.channel === "in_app") ||
        (emailChannelFilter === FILTER_STATES.ON && log.channel === "email");

      return matchesUserId && matchesEmail && matchesChannel;
    });
    setFilteredLogs(newFilteredLogs);
  }, [deadLogs, userIdFilter, emailFilter, inAppFilter, emailChannelFilter]);

  const handleToggle = (
    filterSetter: (value: React.SetStateAction<FilterState>) => void
  ) => {
    filterSetter((prev) =>
      prev === FILTER_STATES.EXCLUDE ? FILTER_STATES.ON : FILTER_STATES.EXCLUDE
    );
  };

  return (
    <div className="overflow-x-auto w-full">
      <div className="flex flex-wrap gap-4 p-4 border-b">
        <div className="flex flex-col transform translate-y-[-8px]">
          <TextInput
            style={{ background: "#233142", color: "#F3F4F5" }}
            id="userIdFilter"
            placeholder="Enter recipient ID"
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
          />
        </div>
        <div className="flex flex-col transform translate-y-[-8px]">
          <TextInput
            style={{ background: "#233142", color: "#F3F4F5" }}
            id="emailFilter"
            placeholder="Enter receiver email"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex space-x-2">
            <FaRegBell
              color={COLORS[inAppFilter]}
              size={24}
              onClick={() => handleToggle(setInAppFilter)}
              className={"cursor-pointer"}
            />
            <MdOutlineEmail
              color={COLORS[emailChannelFilter]}
              size={24}
              onClick={() => handleToggle(setEmailChannelFilter)}
              className={"cursor-pointer"}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex space-x-2 translate-y-[-3px]">
            <Button
              pill
              size="xs"
              color={COLORS.button}
              as="span"
              className="cursor-pointer"
              onClick={() => {
                setUserIdFilter("");
                setEmailFilter("");
                setInAppFilter(FILTER_STATES.ON);
                setEmailChannelFilter(FILTER_STATES.ON);
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
      {loadingDLQ ? (
        <div className="flex justify-center items-center p-8">
          <Spinner aria-label="Loading" size="xl" className="text-gray-500" />
          <span className="ml-3 text-gray-500">Loading logs...</span>
        </div>
      ) : (
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell className="bg-[#233142]">Log ID</Table.HeadCell>
            <Table.HeadCell className="bg-[#233142]">
              Recipient ID
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#233142]">Channel</Table.HeadCell>
            <Table.HeadCell className="bg-[#233142]">Message</Table.HeadCell>
            <Table.HeadCell className="bg-[#233142]">Subject</Table.HeadCell>
            <Table.HeadCell className="bg-[#233142]">
              Receiver Email
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <Table.Row
                  key={log.notification_id}
                  className="dark:border-gray-700 dark:bg-gray-800 hover:bg-[#6B778D]"
                >
                  <Table.Cell>{log.notification_id}</Table.Cell>
                  <Table.Cell>
                    <span
                      className="hover:text-blue-600 hover:underline cursor-pointer"
                      onClick={() => navigate(`/users?id=${log.user_id}`)}
                    >
                      {log.user_id}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    {log.channel === "in_app" ? (
                      <FaRegBell size={16} />
                    ) : (
                      <MdOutlineEmail size={16} />
                    )}
                  </Table.Cell>
                  <Table.Cell>{log.body.message}</Table.Cell>
                  <Table.Cell>{log.body.subject}</Table.Cell>
                  <Table.Cell>{log.body.receiver_email}</Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell
                  colSpan={6}
                  className="text-center p-4 text-gray-500"
                >
                  No logs match the current filter criteria.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      )}
    </div>
  );
}

export default DlqTable;

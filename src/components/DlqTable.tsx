import { Table, TextInput, Checkbox, Label, Spinner } from "flowbite-react";
import { deadLog } from "../types";
import { useEffect, useState } from "react";
import { fetchDlq } from "../utils";

interface DlqTableProps {
  deadLogs: deadLog[] | null;
  setDeadLogs: React.Dispatch<React.SetStateAction<deadLog[] | null>>;
}

function DlqTable({ deadLogs, setDeadLogs }: DlqTableProps) {
  const [filteredLogs, setFilteredLogs] = useState<deadLog[] | null>(null);
  const [userIdFilter, setUserIdFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [showInApp, setShowInApp] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    (async () => {
      await fetchDlq(setDeadLogs);
    })();
  }, []);

  useEffect(() => {
    if (!deadLogs) return;

    const newFilteredLogs = deadLogs.filter((log) => {
      const matchesUserId = log.user_id
        .toLowerCase()
        .includes(userIdFilter.toLowerCase());
      const matchesEmail = (log.body.receiver_email || "")
        .toLowerCase()
        .includes(emailFilter.toLowerCase());
      const matchesChannel =
        (!showInApp && !showEmail) ||
        (showInApp && log.channel === "in_app") ||
        (showEmail && log.channel === "email");

      return matchesUserId && matchesEmail && matchesChannel;
    });
    setFilteredLogs(newFilteredLogs);
  }, [deadLogs, userIdFilter, emailFilter, showInApp, showEmail]);

  return (
    <div className="overflow-x-auto w-full">
      <div className="flex flex-wrap gap-4 p-4 border-b">
        <div className="flex flex-col">
          <Label htmlFor="userIdFilter">Filter by Recipient ID</Label>
          <TextInput
            id="userIdFilter"
            placeholder="Enter recipient ID"
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="emailFilter">Filter by Receiver Email</Label>
          <TextInput
            id="emailFilter"
            placeholder="Enter receiver email"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inAppFilter"
            checked={showInApp}
            onChange={() => setShowInApp(!showInApp)}
          />
          <Label htmlFor="inAppFilter">In-App</Label>

          <Checkbox
            id="emailFilterCheckbox"
            checked={showEmail}
            onChange={() => setShowEmail(!showEmail)}
          />
          <Label htmlFor="emailFilterCheckbox">Email</Label>
        </div>
      </div>
      {filteredLogs === null ? (
        <div className="flex justify-center items-center p-8">
          <Spinner aria-label="Loading" size="xl" className="text-gray-500" />
          <span className="ml-3 text-gray-500">Loading logs...</span>
        </div>
      ) : (
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Log ID</Table.HeadCell>
            <Table.HeadCell>Recipient ID</Table.HeadCell>
            <Table.HeadCell>Channel</Table.HeadCell>
            <Table.HeadCell>Message</Table.HeadCell>
            <Table.HeadCell>Subject</Table.HeadCell>
            <Table.HeadCell>Receiver Email</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <Table.Row
                  key={log.notification_id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>{log.notification_id}</Table.Cell>
                  <Table.Cell>{log.user_id}</Table.Cell>
                  <Table.Cell>{log.channel}</Table.Cell>
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

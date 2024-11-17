import { useEffect, useState } from "react";
import {
  Badge,
  Table,
  TextInput,
  Label,
  Spinner,
  Button,
  Drawer,
  List,
} from "flowbite-react";
import { FaRegBell } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import formatDate from "../utils/formatDate";
import { InAppNotificationLog, EmailNotificationLog } from "../types";
import { COLORS } from "../utils";

const FILTER_STATES = {
  ON: "on",
  EXCLUDE: "exclude",
} as const;

type FilterState = (typeof FILTER_STATES)[keyof typeof FILTER_STATES];

function LogsTable() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialIdFilter = searchParams.get("userid") || "";

  const [logs, setLogs] = useState<
    (InAppNotificationLog | EmailNotificationLog)[]
  >([]);
  const [filteredLogs, setFilteredLogs] = useState<
    (InAppNotificationLog | EmailNotificationLog)[]
  >([]);
  const [selectedLog, setSelectedLog] = useState<
    InAppNotificationLog | EmailNotificationLog | undefined
  >();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [idFilter, setIdFilter] = useState(initialIdFilter);
  const [inAppFilter, setInAppFilter] = useState<FilterState>("on");
  const [emailChannelFilter, setEmailChannelFilter] =
    useState<FilterState>("on");

  const handleOpen = (log: InAppNotificationLog | EmailNotificationLog) => {
    setSelectedLog(log);
    setIsOpen(true);
  };

  const handleClose = () => {
    setSelectedLog(undefined); // what to do here for removing selected log
    setIsOpen(false);
  };

  useEffect(() => {
    const getNotificationLogs = async () => {
      try {
        const apiUrl = import.meta.env.VITE_HTTP_GATEWAY;
        const apiSecret = import.meta.env.VITE_API_KEY;

        const url = apiUrl + `/notifications`;

        let response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: apiSecret,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const fetchedLogs = await response.json();
        setLogs(fetchedLogs);
      } catch (error) {
        console.log("Error fetching notification logs", error);
      } finally {
        setLoading(false);
      }
    };

    getNotificationLogs();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      setFilteredLogs(
        logs.filter((log) => {
          const matchesId = log.user_id
            .toLowerCase()
            .includes(idFilter.toLowerCase());

          const matchesChannel =
            (inAppFilter === FILTER_STATES.ON && log.channel === "in_app") ||
            (emailChannelFilter === FILTER_STATES.ON &&
              log.channel === "email");

          return matchesId && matchesChannel;
        })
      );
    };

    applyFilters();
  }, [logs, idFilter, inAppFilter, emailChannelFilter]);

  function sortAndFilterLogs(
    logs: (InAppNotificationLog | EmailNotificationLog)[]
  ) {
    logs = JSON.parse(JSON.stringify(logs));

    // sort the logs to group by created_at most recent to least recent log
    logs.sort((logA, logB) => {
      const dateA = new Date(logA.created_at);
      const dateB = new Date(logB.created_at);

      if (dateA > dateB) {
        // date A came after date B
        return -1;
      } else if (dateA < dateB) {
        return 1;
      } else {
        return 0;
      }
    });

    let mostRecent = [];
    let prevNotifId;

    for (let index = 0; index < logs.length; index++) {
      let log = logs[index];

      if (log.notification_id === prevNotifId) {
        continue;
      }

      // if there is no log with a matching notification_id, add to most recent array
      let match = !!mostRecent.find(
        (obj) => obj.notification_id === log.notification_id
      );

      if (!match) {
        mostRecent.push(log);
        prevNotifId = log.notification_id;
      }
    }

    return mostRecent;
  }

  function getBadge(log: InAppNotificationLog | EmailNotificationLog) {
    const STATUS_STATES = {
      success: [
        "Notification not sent - channel disabled by user.",
        "Notification read.",
        "Notification sent.",
        "Notification deleted.",
        "Email sent.",
      ],
      pending: ["Notification queued for sending."], // here
      failure: [
        "Notification unable to be broadcast.",
        "Email could not be sent.",
      ],
      warning: ["Notification request received."],
    } as const;

    let log_status: keyof typeof STATUS_STATES | undefined;

    for (let key in STATUS_STATES) {
      if (
        (
          STATUS_STATES[key as keyof typeof STATUS_STATES] as readonly string[]
        ).includes(log.status)
      ) {
        log_status = key as keyof typeof STATUS_STATES;
      }
    }

    let badgeColor;

    switch (log_status) {
      case "success":
        badgeColor = "success";
        break;
      case "pending":
        badgeColor = "info";
        break;
      case "failure":
        badgeColor = "failure";
        break;
      case "warning":
        badgeColor = "warning";
        break;
      default:
        badgeColor = "Dark"; // Dark badges indicate a conditional statement needed for the status
    }

    return (
      <div className="flex flex-wrap gap-2">
        <Badge color={badgeColor}>{log_status}</Badge>
      </div>
    );
  }

  function getDrawerBadge(log: InAppNotificationLog | EmailNotificationLog) {
    let badgeColor;

    switch (log.status) {
      case "Notification request received.":
        badgeColor = "pink";
        break;
      case "Notification sent.":
        badgeColor = "success";
        break;
      case "Notification not sent - channel disabled by user.":
        badgeColor = "warning";
        break;
      case "Notification queued for sending.":
        badgeColor = "info";
        break;
      case "Notification unable to be broadcast.":
        badgeColor = "failure";
        break;
      case "Notification read.":
        badgeColor = "purple";
        break;
      case "Notification deleted.":
        badgeColor = "indigo";
        break;
      case "Email sent.":
        badgeColor = "success";
        break;
      case "Email could not be sent.":
        badgeColor = "failure";
        break;
      default:
        badgeColor = "Dark"; // Dark badges indicate a conditional statement needed for the status
    }

    return (
      <div className="flex flex-wrap gap-2">
        <Badge color={badgeColor}>{log.status}</Badge>
      </div>
    );
  }

  const handleToggle = (
    filterSetter: (value: React.SetStateAction<FilterState>) => void
  ) => {
    filterSetter((prev) =>
      prev === FILTER_STATES.EXCLUDE ? FILTER_STATES.ON : FILTER_STATES.EXCLUDE
    );
  };

  const filterDrawer = () => {
    const subLogs = filteredLogs.filter(
      (log) =>
        log.notification_id === selectedLog!.notification_id &&
        log.log_id !== selectedLog!.log_id
    );

    return subLogs.length === 0 ? (
      <Table.Row>
        <Table.Cell colSpan={5} className="text-center p-4 text-gray-500">
          No associated notification logs to display.
        </Table.Cell>
      </Table.Row>
    ) : (
      subLogs
        .concat(selectedLog!)
        .sort((logA, logB) => {
          const dateA = new Date(logA.created_at);
          const dateB = new Date(logB.created_at);

          if (dateA > dateB) {
            // date A came after date B
            return -1;
          } else if (dateA < dateB) {
            return 1;
          } else {
            return 0;
          }
        })
        .map((log) => {
          return (
            <Table.Row
              key={log.log_id}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {getDrawerBadge(log)}
              </Table.Cell>
              <Table.Cell>{formatDate(log.created_at)}</Table.Cell>
            </Table.Row>
          );
        })
    );
  };

  const tableData = sortAndFilterLogs(filteredLogs);

  return (
    <div className="overflow-x-auto w-full">
      <div className="flex flex-wrap gap-4 p-4 border-b">
        <div className="flex flex-col">
          <Label htmlFor="idFilter">Filter by Recipient ID</Label>
          <TextInput
            id="idFilter"
            placeholder="Enter recipient ID"
            value={idFilter}
            onChange={(e) => {
              setIdFilter(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col">
          <Label className="mb-2">Filter by Channel</Label>
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
          <Label className="mb-2">Remove Filters</Label>
          <div className="flex space-x-2">
            <Button
              pill
              size="xs"
              color={COLORS.button}
              as="span"
              className="cursor-pointer"
              onClick={() => {
                setIdFilter("");
                setInAppFilter(FILTER_STATES.ON);
                setEmailChannelFilter(FILTER_STATES.ON);
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Spinner aria-label="Loading" size="xl" className="text-gray-500" />
          <span className="ml-3 text-gray-500">
            Loading notification logs...
          </span>
        </div>
      ) : (
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Telegraph Status</Table.HeadCell>
            <Table.HeadCell>Recipient ID</Table.HeadCell>
            <Table.HeadCell>Channel</Table.HeadCell>
            <Table.HeadCell>Notification Status</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {tableData.length > 0 ? (
              tableData.map((log) => {
                return (
                  <Table.Row
                    onClick={() => handleOpen(log)}
                    key={log.log_id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {getBadge(log)}
                    </Table.Cell>
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
                    <Table.Cell>{log.status}</Table.Cell>
                    <Table.Cell>{formatDate(log.created_at)}</Table.Cell>
                  </Table.Row>
                );
              })
            ) : (
              <Table.Row>
                <Table.Cell
                  colSpan={5}
                  className="text-center p-4 text-gray-500"
                >
                  No notification logs to display.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      )}
      {selectedLog ? (
        <Drawer
          className="w-3/4"
          open={isOpen}
          onClose={() => handleClose()}
          position="right"
        >
          <Drawer.Header title={"Notification Logs:"} titleIcon={() => <></>} />
          <Drawer.Items>
            <List
              unstyled
              className="max-w-md divide-y divide-gray-200 dark:divide-gray-700"
            >
              <List.Item className="pb-3 sm:pb-4">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  {selectedLog.channel === "in_app" ? (
                    <FaRegBell size={16} />
                  ) : (
                    <MdOutlineEmail size={16} />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      <span
                        className="hover:text-blue-600 hover:underline cursor-pointer"
                        onClick={() =>
                          navigate(`/users?id=${selectedLog.user_id}`)
                        }
                      >
                        {selectedLog.user_id}
                      </span>
                    </p>
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                      Message: {selectedLog.message}
                    </p>
                  </div>
                </div>
              </List.Item>
            </List>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Notification Status</Table.HeadCell>
                <Table.HeadCell>Date</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">{filterDrawer()}</Table.Body>
            </Table>
          </Drawer.Items>
        </Drawer>
      ) : null}
    </div>
  );
}

export default LogsTable;

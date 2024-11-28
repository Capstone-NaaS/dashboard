import { useEffect, useState } from "react";
import {
  Badge,
  Table,
  TextInput,
  Spinner,
  Button,
  Drawer,
  List,
} from "flowbite-react";
import { FaRegBell } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import formatDate from "../utils/formatDate";
import {
  InAppNotificationLog,
  EmailNotificationLog,
  SlackNotificationLog,
} from "../types";
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
    (InAppNotificationLog | EmailNotificationLog | SlackNotificationLog)[]
  >([]);
  const [filteredLogs, setFilteredLogs] = useState<
    (InAppNotificationLog | EmailNotificationLog | SlackNotificationLog)[]
  >([]);
  const [selectedLog, setSelectedLog] = useState<
    | InAppNotificationLog
    | EmailNotificationLog
    | SlackNotificationLog
    | undefined
  >();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [idFilter, setIdFilter] = useState(initialIdFilter);
  const [inAppFilter, setInAppFilter] = useState<FilterState>("on");
  const [emailChannelFilter, setEmailChannelFilter] =
    useState<FilterState>("on");

  const handleOpen = (
    log: InAppNotificationLog | EmailNotificationLog | SlackNotificationLog
  ) => {
    setSelectedLog(log);
    setIsOpen(true);
  };

  const handleClose = () => {
    setSelectedLog(undefined);
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
    logs: (InAppNotificationLog | EmailNotificationLog | SlackNotificationLog)[]
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

  function getBadge(
    log: InAppNotificationLog | EmailNotificationLog | SlackNotificationLog
  ) {
    const STATUS_STATES = {
      success: [
        "In-app notification not sent - channel disabled by user.",
        "In-app notification read.",
        "In-app notification sent.",
        "In-app notification deleted.",
        "Email sent.",
        "Slack notification sent.",
      ],
      pending: ["In-app notification queued for sending."],
      failure: [
        "In-app notification unable to be broadcast.",
        "Error sending email.",
        "Email could not be sent: SES failure.",
        "Slack notification could not be sent.",
        "Error sending Slack notification.",
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

    switch (log_status) {
      case "success":
        return (
          <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
            <span className="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
            Success
          </span>
        );

      case "pending":
        return (
          <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
            <span className="w-2 h-2 me-1 bg-blue-500 rounded-full"></span>
            Pending
          </span>
        );

      case "failure":
        return (
          <span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
            <span className="w-2 h-2 me-1 bg-red-500 rounded-full"></span>
            Failure
          </span>
        );

      case "warning":
        return (
          <span className="inline-flex items-center bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-300">
            <span className="w-2 h-2 me-1 bg-orange-500 rounded-full"></span>
            Warning
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
            <span className="w-2 h-2 me-1 bg-pink-500 rounded-full"></span>
            Untracked Status!
          </span>
        );
    }
  }

  function getDrawerBadge(
    log: InAppNotificationLog | EmailNotificationLog | SlackNotificationLog
  ) {
    let badgeColor;

    switch (log.status) {
      case "Notification request received.":
        badgeColor = "pink";
        break;

      case "In-app notification sent.":
      case "Email sent.":
      case "Slack notification sent.":
        badgeColor = "success";
        break;

      case "Notification not sent - channel disabled by user.":
        badgeColor = "warning";
        break;

      case "In-app notification queued for sending.":
        badgeColor = "info";
        break;

      case "In-app notification unable to be broadcast.":
      case "Email could not be sent: SES failure.":
      case "Error sending email.":
      case "Slack notification could not be sent.":
      case "Error sending Slack notification.":
        badgeColor = "failure";
        break;

      case "In-app notification read.":
        badgeColor = "purple";
        break;

      case "In-app notification deleted.":
        badgeColor = "indigo";
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
        <Table.Cell colSpan={5} className="text-center p-4">
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
            <Table.Row key={log.log_id}>
              <Table.Cell className="whitespace-nowrap font-medium dark:text-white">
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
    <div className="w-full">
      <div>
        <h1
          style={{
            color: "#F3F4F5",
            fontWeight: "800",
            fontSize: "32px",
          }}
          className="transform translate-x-4"
        >
          Notification Logs
        </h1>
      </div>
      <div className="flex flex-wrap gap-6 p-4 border-b">
        <div>
          <h2
            style={{
              color: "#F3F4F5",
              fontWeight: "800",
            }}
          >
            Filters:{" "}
          </h2>
        </div>
        <div className="flex flex-col transform translate-y-[-8px]">
          <TextInput
            style={{ background: "#233142", color: "#F3F4F5" }}
            id="idFilter"
            placeholder="Enter recipient ID"
            value={idFilter}
            onChange={(e) => {
              setIdFilter(e.target.value);
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
              color={COLORS[emailChannelFilter]}
              size={24}
              onClick={() => handleToggle(setEmailChannelFilter)}
              className={"cursor-pointer"}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex space-x-2 tranform translate-y-[-3px]">
            <Button
              pill
              size="xs"
              as="span"
              className="cursor-pointer bg-customPink"
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
      <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
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
              <Table.HeadCell className="bg-[#233142]">
                Telegraph Status
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#233142]">
                Recipient ID
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#233142]">Channel</Table.HeadCell>
              <Table.HeadCell className="bg-[#233142]">
                Notification Status
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#233142]">Date</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {tableData.length > 0 ? (
                tableData.map((log) => {
                  return (
                    <Table.Row
                      onClick={() => handleOpen(log)}
                      key={log.log_id}
                      className="hover:bg-[#6B778D] cursor-pointer"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium dark:text-white">
                        {getBadge(log)}
                      </Table.Cell>
                      <Table.Cell>
                        <span
                          className=" hover:underline cursor-pointer"
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
                  <Table.Cell colSpan={5} className="text-center p-4">
                    No notification logs to display.
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        )}
      </div>
      {selectedLog ? (
        <Drawer
          className="w-2/3 custom-slide-in  bg-[#233142]"
          open={isOpen}
          onClose={() => handleClose()}
          position="right"
        >
          <Drawer.Header
            titleIcon={() => (
              <span className="text-white text-xl">Notification Logs:</span>
            )}
          />
          <Drawer.Items>
            <List
              unstyled
              className="max-w-md divide-y divide-gray-200 dark:divide-gray-700 text-white"
            >
              <List.Item className="pb-3 sm:pb-4">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  {selectedLog.channel === "in_app" ? (
                    <FaRegBell size={16} />
                  ) : (
                    <MdOutlineEmail size={16} />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white dark:text-white">
                      <span
                        className="hover:text-blue-600 hover:underline cursor-pointer"
                        onClick={() =>
                          navigate(`/users?id=${selectedLog.user_id}`)
                        }
                      >
                        {selectedLog.user_id}
                      </span>
                    </p>
                    <p className="truncate text-sm text-white dark:text-gray-400">
                      Message: {selectedLog.message}
                    </p>
                  </div>
                </div>
              </List.Item>
            </List>
            <Table>
              <Table.Head>
                <Table.HeadCell className="bg-[#233142]">
                  Notification Status
                </Table.HeadCell>
                <Table.HeadCell className="bg-[#233142]">Date</Table.HeadCell>
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

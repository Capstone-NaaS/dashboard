import { useEffect, useState } from "react";
import {
  Badge,
  Table,
  TextInput,
  Label,
  Spinner,
  Button,
  Drawer,
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
    let badgeColor;

    switch (log.status) {
      case "Notification request received.":
        badgeColor = "pink";
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
        <Table.Cell colSpan={5} className="text-center p-4">
          No associated notification logs to display.
        </Table.Cell>
      </Table.Row>
    ) : (
      subLogs.map((log) => {
        return (
          <Table.Row
            key={log.log_id}
            className="dark:border-gray-700 dark:bg-gray-800"
          >
            <Table.Cell className="whitespace-nowrap font-medium dark:text-white">
              {getBadge(log)}
            </Table.Cell>
            <Table.Cell>
              <span
                className="hover:underline cursor-pointer"
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
            <Table.Cell>{log.message}</Table.Cell>
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
        {/* <div>
          <h2>Notification Logs Filtering: </h2>
        </div> */}
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
            <Table.HeadCell className="bg-[#233142]">Status</Table.HeadCell>
            <Table.HeadCell className="bg-[#233142]">
              Recipient ID
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#233142]">Channel</Table.HeadCell>
            <Table.HeadCell className="bg-[#233142]">Message</Table.HeadCell>
            <Table.HeadCell className="bg-[#233142]">Date</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {tableData.length > 0 ? (
              tableData.map((log) => {
                return (
                  <Table.Row
                    key={log.log_id}
                    className="hover:bg-[#6B778D] cursor-pointer"
                    onClick={() => handleOpen(log)}
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
                    <Table.Cell>{log.message}</Table.Cell>
                    <Table.Cell className="truncate">
                      {formatDate(log.created_at)}
                    </Table.Cell>
                  </Table.Row>
                );
              })
            ) : (
              <Table.Row>
                <Table.Cell colSpan={5} className="text-center p-4">
                  No notification logs to display.
                </Table.Cell>
                <Table.Cell onClick={() => handleOpen(log)}>
                  <p className="font-medium hover:underline">Log Details</p>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      )}
      {selectedLog ? (
        <Drawer
          className="w-2/3 custom-slide-in"
          open={isOpen}
          onClose={() => handleClose()}
          position="right"
        >
          <Drawer.Header
            title={"Associated Notification Logs:"}
            titleIcon={() => <></>}
          />
          <Drawer.Items>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Recipient ID</Table.HeadCell>
                <Table.HeadCell>Channel</Table.HeadCell>
                <Table.HeadCell>Message</Table.HeadCell>
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

import { Sidebar } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import BackendSDK from "../../../backend-sdk/src/index.ts";
const apiUrl = import.meta.env.VITE_HTTP_GATEWAY;

const naas = new BackendSDK("secretkey1", apiUrl!);

// const MOCK_LOGS = [
//   {
//     user_id: 1,
//     created_at: "Wed, 30 Oct 2024 23:26:20 GMT",
//     channel: "in-app",
//     log_id: "fcf86d0f-8fcd-49a9-a61d-343ea5761a36",
//     message: "User 1 has logged in",
//     notification_id: "4b820132-7e16-43db-9347-c0e9dac5bc5f",
//     status: "notification request received",
//   },
//   {
//     user_id: 2,
//     created_at: "Wed, 30 Oct 2024 23:26:20 GMT",
//     channel: "in-app",
//     log_id: "fcf86d0f-8fcd-49a9-a61d-343ea5761a37",
//     message: "User 2 has logged in",
//     notification_id: "4b820132-7e16-43db-9347-c0e9dac5bc5g",
//     status: "notification request received",
//   },
//   {
//     user_id: 3,
//     created_at: "Wed, 30 Oct 2024 23:26:20 GMT",
//     channel: "in-app",
//     log_id: "fcf86d0f-8fcd-49a9-a61d-343ea5761a38",
//     message: "User 3 has logged in",
//     notification_id: "4b820132-7e16-43db-9347-c0e9dac5bc5h",
//     status: "notification request received",
//   },
// ];

function LogsSidebar({ logs }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent) => {
    const logId = event.currentTarget.getAttribute("data-key");
    navigate(`/notification-logs/${logId}`);
  };

  return (
    <Sidebar className="flex-grow" aria-label="Default sidebar example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {logs.map((log) => {
            return (
              <Sidebar.Item
                key={log.log_id}
                onClick={handleClick}
                data-key={log.log_id}
                active={location.search.includes(log.log_id)}
              >
                {log.message}
              </Sidebar.Item>
            );
          })}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default LogsSidebar;

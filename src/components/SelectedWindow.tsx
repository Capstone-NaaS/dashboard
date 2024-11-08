import { useLocation } from "react-router-dom";
import Placeholder from "./SidebarPlaceholder.tsx";
import UsersTable from "./UsersTable.tsx";
import LogsTable from "./LogsTable.tsx";
import ExampleChart from "./Chart.tsx";
import SignIn from "./SignIn.tsx";

function SelectedWindow({ notifLogs, userLogs }) {
  const location = useLocation();

  return (
    <>
      {location.pathname.includes("/notification-logs") && (
        <LogsTable logs={notifLogs} />
      )}
      {location.pathname === "/users" && <UsersTable logs={userLogs} />}
      {location.pathname === "/analytics" && <ExampleChart />}
      {location.pathname === "/sign-in" && <SignIn />}
    </>
  );
}

export default SelectedWindow;

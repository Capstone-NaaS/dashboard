import { useLocation } from "react-router-dom";
import UsersTable from "./UsersTable.tsx";
import LogsTable from "./LogsTable.tsx";
import DlqTable from "./DlqTable.tsx";
import AnalyticsChart from "./Chart.tsx";
import SignIn from "./SignIn.tsx";

function SelectedWindow({ notifLogs, userLogs, dlqLogs }) {
  const location = useLocation();

  return (
    <>
      {location.pathname.includes("/notification-logs") && (
        <LogsTable logs={notifLogs} />
      )}
      {location.pathname === "/users" && <UsersTable logs={userLogs} />}
      {location.pathname === "/analytics" && <AnalyticsChart />}
      {location.pathname === "/dlq" && <DlqTable logs={dlqLogs} />}
      {location.pathname === "/sign-in" && <SignIn />}
    </>
  );
}

export default SelectedWindow;

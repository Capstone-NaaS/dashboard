import { useLocation } from "react-router-dom";
import UsersTable from "./UsersTable.tsx";
import LogsTable from "./LogsTable.tsx";
import DlqTable from "./DlqTable.tsx";
import AnalyticsChart from "./Chart.tsx";
import SignIn from "./SignIn.tsx";

function SelectedWindow({ dlqLogs }) {
  const location = useLocation();

  return (
    <>
      {location.pathname.includes("/notification-logs") && <LogsTable />}
      {location.pathname === "/users" && <UsersTable />}
      {location.pathname === "/analytics" && <AnalyticsChart />}
      {location.pathname === "/dlq" && <DlqTable logs={dlqLogs} />}
      {location.pathname === "/sign-in" && <SignIn />}
    </>
  );
}

export default SelectedWindow;

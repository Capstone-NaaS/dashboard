import { useLocation } from "react-router-dom";
import UsersTable from "./UsersTable.tsx";
import LogsTable from "./LogsTable.tsx";
import DlqTable from "./DlqTable.tsx";
import AnalyticsChart from "./Chart.tsx";
import { deadLog } from "../types/index.ts";

interface SelectedWindowProps {
  deadLogs: deadLog[] | null;
  setDeadLogs: React.Dispatch<React.SetStateAction<deadLog[] | null>>;
}

function SelectedWindow({ deadLogs, setDeadLogs }: SelectedWindowProps) {
  const location = useLocation();

  return (
    <>
      {location.pathname.includes("/notification-logs") && <LogsTable />}
      {location.pathname === "/users" && <UsersTable />}
      {location.pathname === "/analytics" && <AnalyticsChart />}
      {location.pathname === "/dlq" && (
        <DlqTable deadLogs={deadLogs} setDeadLogs={setDeadLogs} />
      )}
    </>
  );
}

export default SelectedWindow;

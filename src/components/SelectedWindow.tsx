import { useLocation } from "react-router-dom";
import UsersTable from "./UsersTable.tsx";
import LogsTable from "./LogsTable.tsx";
import DlqTable from "./DlqTable.tsx";
import AnalyticsChart from "./Chart.tsx";
import { deadLog } from "../types/index.ts";

interface SelectedWindowProps {
  deadLogs: deadLog[];
  setDeadLogs: React.Dispatch<React.SetStateAction<deadLog[]>>;
  loadingDLQ: boolean;
  setLoadingDLQ: React.Dispatch<React.SetStateAction<boolean>>;
  fetchInProgressRef: React.MutableRefObject<boolean>;
}

function SelectedWindow({
  deadLogs,
  setDeadLogs,
  loadingDLQ,
  setLoadingDLQ,
  fetchInProgressRef,
}: SelectedWindowProps) {
  const location = useLocation();

  return (
    <div className="overflow-x-auto bg-[#233142] flex-grow pt-4 px-5">
      {location.pathname.includes("/notification-logs") && <LogsTable />}
      {location.pathname === "/users" && <UsersTable />}
      {location.pathname === "/analytics" && <AnalyticsChart />}
      {location.pathname === "/dlq" && (
        <DlqTable
          deadLogs={deadLogs}
          setDeadLogs={setDeadLogs}
          loadingDLQ={loadingDLQ}
          setLoadingDLQ={setLoadingDLQ}
          fetchInProgressRef={fetchInProgressRef}
        />
      )}
    </div>
  );
}

export default SelectedWindow;

import { useLocation } from "react-router-dom";
import UsersTable from "./UsersTable.tsx";
import LogsTable from "./LogsTable.tsx";
import ExampleChart from "./Chart.tsx";
import SignIn from "./SignIn.tsx";

function SelectedWindow() {
  const location = useLocation();

  return (
    <>
      {location.pathname.includes("/notification-logs") && <LogsTable />}
      {location.pathname === "/users" && <UsersTable />}
      {location.pathname === "/analytics" && <ExampleChart />}
      {location.pathname === "/sign-in" && <SignIn />}
    </>
  );
}

export default SelectedWindow;

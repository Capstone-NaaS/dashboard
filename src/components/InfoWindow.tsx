import { useLocation } from "react-router-dom";
import LogTable from "./LogTable.tsx";

function InfoWindow() {
  const location = useLocation();
  console.log({ location });

  return (
    <>
      {location.pathname === "/notification-logs" && <LogTable />}
      {/* {location.pathname === "/my-users" && <UsersSidebar />} */}
      {/* {location.pathname === "/" && <HomeComponent />} */}
    </>
  );
}

export default InfoWindow;

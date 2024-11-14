import { useLocation, matchPath } from "react-router-dom";

function InfoWindow() {
  const location = useLocation();
  const [path, id] = [...location.pathname.split("/").filter(Boolean)];

  if (!id) {
    return <></>;
  }

  return (
    <>
      {/* {matchPath("/notification-logs/:id", location.pathname)?.pattern.path ===
        "/notification-logs/:id" && (
        <LogTable log={notifLogs.filter((log) => log.log_id === id).pop()} />
      )} */}
      {/* {location.pathname === "/user" && <UsersSidebar />} */}
      {/* {location.pathname === "/" && <HomeComponent />} */}
    </>
  );
}

export default InfoWindow;

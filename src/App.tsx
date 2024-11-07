import { BrowserRouter as Router } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import CategorySidebar from "./components/CategorySidebar";
import SelectedWindow from "./components/SelectedWindow";
import InfoWindow from "./components/InfoWindow";
import BackendSDK from "./../../backend-sdk/src/index.ts";

const apiUrl = import.meta.env.VITE_HTTP_GATEWAY;
const naas = new BackendSDK("secretkey1", apiUrl!);
const MOCK_USERS = [
  {
    id: 1,
    name: "Erin Olson",
    email: "erin@mail.com",
    created_at: "Oct 14, 06:24 PM",
    last_seen: "Nov 2, 11:34 AM",
    last_notified: "Nov 2, 11:34 AM",
  },
  {
    id: 2,
    name: "Clover Davidson",
    email: "iluvsnacks@mail.com",
    created_at: "Oct 14, 06:24 PM",
    last_seen: "Nov 2, 11:34 AM",
    last_notified: "Nov 2, 11:34 AM",
  },
  {
    id: 3,
    name: "Aster Davidson",
    email: "runsleepsnack@mail.com",
    created_at: "Oct 14, 06:24 PM",
    last_seen: "Nov 2, 11:34 AM",
    last_notified: "Nov 2, 11:34 AM",
  },
];

function App() {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        console.log("fetching logs...");
        const fetchedLogs = await naas.getNotificationLogs();
        setLogs(fetchedLogs);
      } catch (error) {
        console.error("Error fetching logs: ", error);
      }
    };

    const fetchUsers = async () => {
      try {
        console.log("fetching users...");
        const fetchedUsers = await naas.getUser("13");
        //setUsers([fetchedUsers.message]);
        setUsers(MOCK_USERS);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchLogs();
    fetchUsers();
  }, []);

  return (
    <Router>
      <Header />
      <main className="flex h-[calc(100vh-6rem)] items-start justify-center gap-2">
        <CategorySidebar />
        <SelectedWindow notifLogs={logs} userLogs={users} />
        <InfoWindow notifLogs={logs} />
      </main>
    </Router>
  );
}

export default App;

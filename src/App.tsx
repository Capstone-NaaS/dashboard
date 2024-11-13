import { BrowserRouter as Router } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import CategorySidebar from "./components/CategorySidebar";
import SelectedWindow from "./components/SelectedWindow";
import InfoWindow from "./components/InfoWindow";
import BackendSDK from "./../../backend-sdk/src/index.ts";

const apiUrl: string = import.meta.env.VITE_HTTP_GATEWAY;
const API_KEY: string = import.meta.env.VITE_API_KEY;
const naas = new BackendSDK(API_KEY, apiUrl);

function App() {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [dlq, setDlq] = useState([]);

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
        const fetchedUsers = await naas.getAllUsers();
        setUsers(fetchedUsers.message);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    const fetchDlq = async () => {
      try {
        console.log("fetching dlq...");
        let response = await fetch(`${apiUrl}/dlq`, {
          method: "GET",
          headers: {
            Authorization: API_KEY,
          },
        });
        const fetchedDlq = await response.json();
        console.log(fetchedDlq);
        setDlq(fetchedDlq.map((log) => JSON.parse(log)));
      } catch (error) {
        console.error("error fetching dlq: ", error);
      }
    };

    fetchLogs();
    fetchUsers();
    fetchDlq();
  }, []);

  return (
    <Router>
      <Header />
      <main className="flex h-[calc(100vh-6rem)] items-start justify-center gap-2">
        <CategorySidebar hasDlq={dlq.length > 0} />
        <SelectedWindow notifLogs={logs} userLogs={users} dlqLogs={dlq} />
        <InfoWindow notifLogs={logs} />
      </main>
    </Router>
  );
}

export default App;

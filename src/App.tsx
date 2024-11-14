import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header";
import CategorySidebar from "./components/CategorySidebar";
import SelectedWindow from "./components/SelectedWindow";
import { useEffect, useState } from "react";

const apiUrl: string = import.meta.env.VITE_HTTP_GATEWAY;
const API_KEY: string = import.meta.env.VITE_API_KEY;

function App() {
  const [dlq, setDlq] = useState([]);

  useEffect(() => {
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
        setDlq(fetchedDlq.map((log) => JSON.parse(log)));
      } catch (error) {
        console.error("error fetching dlq: ", error);
      }
    };

    fetchDlq();
  }, []);

  return (
    <Router>
      <Header />
      <main className="flex h-[calc(100vh-6rem)] items-start justify-center gap-2">
        <CategorySidebar hasDlq={dlq.length > 0} />
        <SelectedWindow dlqLogs={dlq} />
      </main>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router } from "react-router-dom";
import { Flowbite, useThemeMode } from "flowbite-react";
import flowbiteTheme from "./themes/flowbiteTheme";
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
      <Flowbite theme={{ theme: flowbiteTheme }}>
        <Header />
        <main className="flex h-[calc(100vh-6rem)] items-start justify-center transform translate-x-[-15px]">
          <CategorySidebar hasDlq={dlq.length > 0} />
          <SelectedWindow dlqLogs={dlq} />
        </main>
      </Flowbite>
    </Router>
  );
}

export default App;

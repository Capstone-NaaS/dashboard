import { BrowserRouter as Router } from "react-router-dom";
import { Flowbite, useThemeMode } from "flowbite-react";
import flowbiteTheme from "./themes/flowbiteTheme";
import Header from "./components/Header";
import CategorySidebar from "./components/CategorySidebar";
import SelectedWindow from "./components/SelectedWindow";
import { useEffect, useRef, useState } from "react";
import { deadLog } from "./types";
import { fetchDlq } from "./utils";

function App() {
  const [deadLogs, setDeadLogs] = useState<deadLog[]>([]);
  const [loadingDLQ, setLoadingDLQ] = useState(false);
  const fetchInProgressRef = useRef(false);

  useEffect(() => {
    if (!fetchInProgressRef.current) {
      fetchInProgressRef.current = true;
      (async () => {
        setLoadingDLQ(true);
        await fetchDlq(setDeadLogs);
        setLoadingDLQ(false);
      })();
    }
  }, []);

  return (
    <Router>
      <Flowbite theme={{ theme: flowbiteTheme }}>
        <Header />
        <main className="flex h-[calc(100vh-6rem)]">
          <div>
            <CategorySidebar hasDlq={deadLogs.length > 0} />
          </div>
          <SelectedWindow
            deadLogs={deadLogs}
            setDeadLogs={setDeadLogs}
            loadingDLQ={loadingDLQ}
            setLoadingDLQ={setLoadingDLQ}
            fetchInProgressRef={fetchInProgressRef}
          />
        </main>
      </Flowbite>
    </Router>
  );
}

export default App;

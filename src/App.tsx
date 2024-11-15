import { BrowserRouter as Router } from "react-router-dom";
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
      <Header />
      <main className="flex h-[calc(100vh-6rem)]">
        <div className="w-1/5">
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
    </Router>
  );
}

export default App;

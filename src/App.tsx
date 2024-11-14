import { BrowserRouter as Router } from "react-router-dom";
import { Flowbite, useThemeMode } from "flowbite-react";
import flowbiteTheme from "./themes/flowbiteTheme";
import Header from "./components/Header";
import CategorySidebar from "./components/CategorySidebar";
import SelectedWindow from "./components/SelectedWindow";
import { useEffect, useState } from "react";
import { deadLog } from "./types";
import { fetchDlq } from "./utils";

function App() {
  const [deadLogs, setDeadLogs] = useState<deadLog[]>([]);
  const [loadingDLQ, setLoadingDLQ] = useState(true);

  useEffect(() => {
    (async () => {
      await fetchDlq(setDeadLogs);
    })();
  }, []);

  return (
    <Router>
      <Flowbite theme={{ theme: flowbiteTheme }}>
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
          />
        </main>
      </Flowbite>
    </Router>
  );
}

export default App;

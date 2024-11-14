import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header";
import CategorySidebar from "./components/CategorySidebar";
import SelectedWindow from "./components/SelectedWindow";
import { useEffect, useState } from "react";
import { deadLog } from "./types";
import { fetchDlq } from "./utils";

function App() {
  const [deadLogs, setDeadLogs] = useState<deadLog[] | null>(null);

  useEffect(() => {
    (async () => {
      await fetchDlq(setDeadLogs);
    })();
  }, []);

  return (
    <Router>
      <Header />
      <main className="flex h-[calc(100vh-6rem)] items-start justify-center gap-2">
        <CategorySidebar hasDlq={!!deadLogs && deadLogs.length > 0} />
        <SelectedWindow deadLogs={deadLogs} setDeadLogs={setDeadLogs} />
      </main>
    </Router>
  );
}

export default App;

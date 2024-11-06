import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header";
import CategorySidebar from "./components/CategorySidebar";
import SelectedWindow from "./components/SelectedWindow";
import InfoWindow from "./components/InfoWindow";

function App() {
  return (
    <Router>
      <Header />
      <main className="flex h-[calc(100vh-6rem)] items-start justify-center gap-2">
        <CategorySidebar />
        <SelectedWindow></SelectedWindow>
        <InfoWindow></InfoWindow>
      </main>
    </Router>
  );
}

export default App;

import CategorySidebar from "./components/CategorySidebar";
import LogsSidebar from "./components/LogsSidebar";
import LogTable from "./components/LogTable";
import LogDetailsSidebar from "./components/LogDetailsSidebar";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <main className="flex h-[calc(100vh-6rem)] items-start justify-center gap-2">
        <CategorySidebar />
        <LogsSidebar />
        <LogDetailsSidebar />
        {/* <LogTable /> */}
      </main>
    </>
  );
}

export default App;

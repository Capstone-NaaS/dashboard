import { Sidebar } from "flowbite-react";
import LogTable from "./LogTable";

/*
I think the log details sidebar will contain a log table
that will be set to render when a specific log is selected and
a component that can display a JSON view of the selected log if
the user wants.
*/

function LogsSidebar() {
  return (
    <Sidebar className="w-1/2" aria-label="Default sidebar example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <LogTable />
          {/* Holding place for JSON view */}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default LogsSidebar;

// https://flowbite-react.com/docs/components/sidebar
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiTable, HiUser } from "react-icons/hi";
import { FaChartLine } from "react-icons/fa6";

function CategorySidebar() {
  return (
    <Sidebar className="w-1/5" aria-label="Default sidebar example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item active={true} href="#" icon={HiTable}>
            Notification Logs
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiUser}>
            My Users
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={FaChartLine}>
            Analytics
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiArrowSmRight}>
            Sign In
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default CategorySidebar;

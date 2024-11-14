import { Sidebar } from "flowbite-react";
import { HiTable, HiUser } from "react-icons/hi";
import { FaChartLine } from "react-icons/fa6";
import { BiSolidSkull } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

interface CategorySidebarProps {
  hasDlq: boolean;
}

function CategorySidebar({ hasDlq }: CategorySidebarProps) {
  /*
  The notification logs should be the default active category.
  When the active category is set navigate should be called
  */
  const navigate = useNavigate();
  const location = useLocation();

  const [activeCategory, setActiveCategory] = useState("");

  const CATEGORIES = [
    {
      name: "Notification Logs",
      icon: HiTable,
      path: "notification-logs",
    },
    {
      name: "Users",
      icon: HiUser,
      path: "users",
    },
    {
      name: "Analytics",
      icon: FaChartLine,
      path: "analytics",
    },
    {
      name: "DLQ",
      icon: BiSolidSkull,
      path: "dlq",
    },
  ];
  const ACTIVE_CLASS = "border-b border-gray-500";
  const INACTIVE_CLASS = "";

  // on mount set notification logs as the active category and set
  // notification-logs as entrypoint
  useEffect(() => {
    const currentPath = location.pathname.split("/").pop() || "";
    const matchingCategory = CATEGORIES.find((cat) =>
      currentPath.includes(cat.path)
    );

    if (matchingCategory) {
      setActiveCategory(matchingCategory.path);
    } else if (location.pathname === "/") {
      setActiveCategory("notification-logs");
      navigate("notification-logs");
    }
  }, [location.pathname, location.search]);

  const handleClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    // set active category to clicked category
    const categoryValue = target.textContent?.toLowerCase().replace(" ", "-");

    if (categoryValue) {
      setActiveCategory(categoryValue);
      navigate(categoryValue);
    }
  };

  return (
    <Sidebar aria-label="Default sidebar example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {CATEGORIES.map((category) => {
            return (
              <Sidebar.Item
                key={category.path}
                icon={category.icon}
                onClick={handleClick}
                className={`${
                  activeCategory === category.path
                    ? ACTIVE_CLASS
                    : INACTIVE_CLASS
                } ${
                  category.path === "dlq" && hasDlq
                    ? "bg-red-500 text-white border-red-500 hover:bg-red-600 hover:text-white cursor-pointer"
                    : ""
                }`}
                active={activeCategory === category.path} // honestly not sure if this is necessary
                style={{ cursor: "pointer" }}
              >
                {category.name}
              </Sidebar.Item>
            );
          })}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default CategorySidebar;

import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiTable, HiUser } from "react-icons/hi";
import { FaChartLine } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function CategorySidebar() {
  /*
  The notification logs should be the default active category.
  When the active category is set navigate should be called
  */
  const location = useLocation();
  const navigate = useNavigate();

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
      name: "Sign In",
      icon: HiArrowSmRight,
      path: "sign-in",
    },
  ];
  const ACTIVE_CLASS = "border-b border-gray-500";
  const INACTIVE_CLASS = "";

  // on mount set notification logs as the active category and set
  // notification-logs as entrypoint
  useEffect(() => {
    setActiveCategory("notification-logs");
    navigate("notification-logs");
  }, []);

  const handleClick = (event: React.MouseEvent) => {
    // set active category to clicked category
    const categoryValue = event.target.textContent
      .toLowerCase()
      .replace(" ", "-");
    console.log({ categoryValue });
    setActiveCategory(categoryValue);
    navigate(categoryValue);
  };

  return (
    <Sidebar className="w-1/5" aria-label="Default sidebar example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {CATEGORIES.map((category) => {
            return (
              <Sidebar.Item
                icon={category.icon}
                onClick={handleClick}
                className={`${
                  activeCategory === category.path
                    ? ACTIVE_CLASS
                    : INACTIVE_CLASS
                }`}
                active={activeCategory === category.path} // honestly not sure if this is necessary
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

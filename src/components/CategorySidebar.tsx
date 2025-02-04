import { Sidebar } from "flowbite-react";
import {
  BsTable,
  BsSendExclamation,
  BsPersonFill,
  BsGraphUp,
} from "react-icons/bs";

import { IoWarning } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

interface CategorySidebarProps {
  hasDlq: boolean;
}

function CategorySidebar({ hasDlq }: CategorySidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeCategory, setActiveCategory] = useState("");

  const CATEGORIES = [
    {
      name: "Notification Logs",
      icon: BsTable,
      path: "notification-logs",
    },
    {
      name: "Users",
      icon: BsPersonFill,
      path: "users",
    },
    {
      name: "Analytics",
      icon: BsGraphUp,
      path: "analytics",
    },
    {
      name: "DLQ",
      icon: BsSendExclamation,
      path: "dlq",
    },
  ];
  const ACTIVE_CLASS = "border-b border-gray-500";
  const INACTIVE_CLASS = "";

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
                }`}
                active={activeCategory === category.path}
                style={{ cursor: "pointer" }}
              >
                <div className="flex items-center">
                  {category.name}
                  {category.path === "dlq" && hasDlq ? (
                    <IoWarning size={24} color="#E57373" className="ml-2" />
                  ) : null}
                </div>
              </Sidebar.Item>
            );
          })}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default CategorySidebar;

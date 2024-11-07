import { Sidebar } from "flowbite-react";
import { useNavigate, useLocation } from "react-router-dom";

const MOCK_USERS = [
  {
    user_id: 1,
    name: "Erin Olson",
    email: "erin@mail.com",
  },
  {
    user_id: 2,
    name: "Clover Davidson",
    email: "iluvsnacks@mail.com",
  },
  {
    user_id: 3,
    name: "Aster Davidson",
    email: "runsleeppoop@mail.com",
  },
];

function UsersSidebar({ logs }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent) => {
    const userId = event.currentTarget.getAttribute("data-key");
    navigate(`/user/${userId}`);
  };

  //className="w-4/5"
  console.log("USER SIDEBAR: ", logs);
  return (
    <Sidebar className="flex-grow" aria-label="Default sidebar example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {logs.map((user) => {
            return (
              <Sidebar.Item
                key={user.id}
                data-key={user.id}
                onClick={handleClick}
              >
                {user.name} {user.email}
              </Sidebar.Item>
            );
          })}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default UsersSidebar;

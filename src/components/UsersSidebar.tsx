import { Sidebar } from "flowbite-react";
//import { useEffect, useState } from "react";
//import BackendSDK from "../../../backend-sdk/src/index.ts";
//const apiUrl = import.meta.env.VITE_HTTP_GATEWAY;

//const naas = new BackendSDK("secretkey1", apiUrl!);

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

function UsersSidebar() {
  // const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     const userData = await naas.getUsers(); // need to add to backend sdk
  //     setUsers(userData);
  //   };

  //   fetchUsers();
  // }, []);

  return (
    <Sidebar className="w-1/2" aria-label="Default sidebar example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {MOCK_USERS.map((user) => {
            return (
              <Sidebar.Item key={user.user_id} href="#">
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

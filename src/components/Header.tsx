"use client";

import { Navbar } from "flowbite-react";

function Header() {
  return (
    <Navbar fluid rounded className="h-24">
      <Navbar.Brand className="flex justify-start">
        <img
          src="./public/telegraph.png"
          className="h-20 transform translate-y-4 translate-x-4"
          alt="Telegraph Logo"
        />
      </Navbar.Brand>
    </Navbar>
  );
}

export default Header;

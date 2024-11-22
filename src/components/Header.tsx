"use client";

import { Navbar } from "flowbite-react";

function Header() {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand className="flex justify-start">
        <img
          src="./public/white_horizontal_transparent.png"
          className="h-20 tranform translate-y-2"
          alt="Telegraph Logo"
        />
        {/* <span className="self-center whitespace-nowrap text-3xl text-[#F5F5F5] mt-1 transform translate-x-[-4px]">
          Telegraph
        </span> */}
      </Navbar.Brand>
    </Navbar>
  );
}

export default Header;

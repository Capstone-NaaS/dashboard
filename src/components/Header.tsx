"use client";

import { Navbar } from "flowbite-react";

function Header() {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand>
        <img
          src="./public/white_horizontal_transparent.png"
          className="mr-3 h-20 sm:h-25 transform translate-x-4 translate-y-2"
          alt="Telegraph Logo"
        />
        {/* <span className="self-center whitespace-nowrap text-3xl text-[#F5F5F5] mt-1 transform translate-x-[-4px]">
          Telegraph
        </span> */}
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="transform translate-x-[-18px]">
        <Navbar.Link href="#" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="#">About</Navbar.Link>
        <Navbar.Link href="#">Services</Navbar.Link>
        <Navbar.Link href="#">Pricing</Navbar.Link>
        <Navbar.Link href="#">Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;

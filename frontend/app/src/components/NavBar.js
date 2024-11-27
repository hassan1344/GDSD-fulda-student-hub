import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import logoFHB from "./assets/images/logoFHB.png"

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { path: "/", name: "Home" },
    { path: "/favorites", name: "Favorites" },
    { path: "/profile", name: "Profile" },
    { path: "/logout", name: "Logout" },
  ];

  return (
    <nav className="flex justify-between items-center bg-white px-8 py-5 shadow-md">
      <img
        src= { logoFHB } // Path to the logo
        alt="Fulda Student Hub Logo"
        className="w-12 h-12 object-contain"
      />
      <h1 className="text-3xl font-bold">Fulda Student Hub</h1>
      <div className="flex space-x-8 text-lg">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={`transition duration-200 px-2 py-1 rounded ${
              location.pathname === link.path
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
            }`}
          >
            {link.name}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;

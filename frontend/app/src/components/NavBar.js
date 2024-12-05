import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logoFHB from "./assets/images/logoFHB.png"

const Navbar = () => {
  const location = useLocation();
  const [showLandlordMenu, setShowLandlordMenu] = useState(false);

  const navLinks = [
    { path: "/", name: "Home" },
    { path: "/favorites", name: "Favorites" },
    { path: "/profile", name: "Profile" },
    { path: "/logout", name: "Logout" },
  ];

  const landlordLinks = [
    { path: "/landlord/requests", name: "Requests" },
    { path: "/landlord/select-requests", name: "Select Requests" },
    { path: "/landlord/tenants", name: "Tenants" },
    { path: "/landlord/properties", name: "Properties" },
  ];

  const toggleLandlordMenu = () => {
    setShowLandlordMenu(!showLandlordMenu);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="flex justify-between items-center px-8 py-5">
        <img
          src={logoFHB}
          alt="Fulda Student Hub Logo"
          className="w-12 h-12 object-contain"
        />
        <h1 className="text-3xl font-bold">Fulda Student Hub</h1>
        <div className="flex space-x-8 text-lg items-center">
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
          <div className="relative">
            <button
              onClick={toggleLandlordMenu}
              className="transition duration-200 px-2 py-1 rounded text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
            >
              Landlord
            </button>
            {showLandlordMenu && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                {landlordLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white"
                    onClick={() => setShowLandlordMenu(false)}
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
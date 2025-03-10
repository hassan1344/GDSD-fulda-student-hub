import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logoFHB from "./assets/images/logoFHB.png";
import { logoutUser } from "../services/authServices";
import { jwtDecode } from "jwt-decode"; // Import the library

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const decodedToken = jwtDecode(accessToken);
  const { userName, userType } = decodedToken;

  const allNavLinks = [
    { path: "/home", name: "Home", roles: ["STUDENT"] },
    { path: "/admin", name: "Home", roles: ["ADMIN"] },
    { path: "/myApplications", name: "Applications", roles: ["STUDENT"] },
    { path: "/myBids", name: "Bids", roles: ["STUDENT"] },
    { path: "/messages", name: "Messages", roles: ["STUDENT"] },
    { path: "/viewProfile", name: "Profile", roles: ["STUDENT"] },
    { path: "/admin/viewProfile", name: "Profile", roles: ["ADMIN"] },
  ];

  const navLinks = allNavLinks.filter(link =>
    link.roles.includes(userType)
  );

  const logoutHandler = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.error("No refresh token found.");
        return;
      }

      // Call the logout API
      const response = await logoutUser({ userName });

      // Clear tokens from local storage
      localStorage.clear();

      // Redirect the user to the login page
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <nav className="bg-white shadow-md w-full z-50">
      <div className="flex justify-between items-center px-8 py-5">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={logoFHB}
            alt="Fulda Student Hub Logo"
            className="w-35 h-20 object-contain"
          />
          {/* <h1 className="text-2xl md:text-3xl font-bold ml-3">Fulda Student Hub</h1> */}
        </div>

        {/* Hamburger Icon (for small screens) */}
        <button
          className="block md:hidden text-gray-600 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Nav Links */}
        <div
          className={`flex flex-col md:flex-row md:space-x-8 text-lg items-center absolute md:static bg-white w-full md:w-auto left-0 top-[70px] md:top-auto transition-all duration-300 ease-in-out z-50 ${
            isMenuOpen ? "block" : "hidden md:flex"
          }`}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={`transition duration-200 px-4 py-2 md:py-0 rounded ${
                location.pathname === link.path
                  ? "text-blue-600 font-semibold border-b-2 md:border-none border-blue-600"
                  : "text-gray-600 hover:text-blue-600 hover:border-b-2 md:hover:border-none hover:border-blue-600"
              }`}
              onClick={() => setIsMenuOpen(false)} // Close menu on link click
            >
              {link.name}
            </NavLink>
          ))}

          {/* Logout Button */}
          <button
            onClick={logoutHandler}
            className="text-gray-600 hover:text-red-600 transition duration-200 px-4 py-2 md:py-0 rounded font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

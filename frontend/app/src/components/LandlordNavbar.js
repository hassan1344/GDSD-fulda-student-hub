import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logoFHB from "../assets/images/logoFHB-Nav.png";
import { logoutUser } from "../services/authServices";
import { jwtDecode } from "jwt-decode";

const LandlordNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("accessToken");

      const decodedToken = jwtDecode(accessToken);
      const { userName } = decodedToken;

      if (!refreshToken) {
        console.error("No refresh token found.");
        return;
      }

      // Call the logout API
      const response = await logoutUser({ userName });

      console.log(response.message); // Logs: "Logged out successfully"

      // Clear tokens from local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Redirect the user to the login page
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  const navLinks = [
    { path: "/landlord", name: "Home" },
    { path: "/messages", name: "Messages" },
    { path: "/landlord/viewProfile", name: "Profile" },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="flex justify-between items-center px-8 py-5">
        {/* Logo and Text (Left) */}
        <div className="flex items-center space-x-4">
          <img
            src={logoFHB}
            alt="Fulda Student Hub Logo"
            className="w-12 h-12 object-contain"
          />
          <h1 className="text-2xl md:text-3xl font-bold">Fulda Student Hub</h1>
        </div>

        {/* Hamburger Menu (for small screens) */}
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

        {/* Navigation Links */}
        <div
          className={`flex flex-col md:flex-row md:space-x-8 text-lg items-center absolute md:static bg-white w-full md:w-auto left-0 top-[70px] md:top-auto transition-all duration-300 ease-in-out ${
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

export default LandlordNavbar;

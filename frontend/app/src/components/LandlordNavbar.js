import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logoFHB from "./assets/images/logoFHB.png";
import { logoutUser } from "../services/authServices";
import { jwtDecode } from "jwt-decode"; // Import the library

const LandlordNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("accessToken");

      const decodedToken = jwtDecode(accessToken);
      const { userName, userType } = decodedToken;

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
      navigate("/", {replace: true});
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };



  const navLinks = [
    { path: "/landlord", name: "Home" },
    { path: "/message", name: "Message" },
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
          <h1 className="text-3xl font-bold">Fulda Student Hub</h1>
        </div>

        {/* Navigation Links (Right) */}
        <div className="flex space-x-8 text-lg items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={`transition duration-200 px-2 py-1 rounded ${location.pathname === link.path
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
                }`}
            >
              {link.name}
            </NavLink>
          ))}
          <button
            onClick={logoutHandler}
            className="text-gray-600 hover:text-red-600 transition duration-200 px-2 py-1 rounded font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>

  );
};

export default LandlordNavbar;
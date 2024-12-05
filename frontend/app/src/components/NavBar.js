import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logoFHB from "./assets/images/logoFHB.png";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: "/", name: "Home" },
    { path: "/favorites", name: "Favorites" },
    { path: "/profile", name: "Profile" },
  ];

  const logoutHandler = () => {
    navigate("/"); // Redirect to login page
    alert("You have been logged out successfully.");
  };

  // const logoutHandler = async () => {
  //   try {
  //     const response = await fetch("/api/v1/auth/logout", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Include JWT token in headers
  //       },
  //     });

  //     if (response.ok) {
  //       // Clear the JWT token from local storage
  //       localStorage.removeItem("jwtToken");
  //       alert("You have been logged out successfully.");
  //       navigate("/"); // Redirect to login page
  //     } else {
  //       alert("Failed to logout. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Logout Error:", error);
  //     alert("An error occurred during logout. Please try again later.");
  //   }
  // };

  return (
    <nav className="flex justify-between items-center bg-white px-8 py-5 shadow-md">
      {/* Logo */}
      <img
        src={logoFHB}
        alt="Fulda Student Hub Logo"
        className="w-12 h-12 object-contain"
      />
      <h1 className="text-3xl font-bold">Fulda Student Hub</h1>

      {/* Navigation Links */}
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

        {/* Logout Button */}
        <button
          onClick={logoutHandler}
          className="text-gray-600 hover:text-blue-600 transition duration-200 px-2 py-1 rounded font-semibold"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
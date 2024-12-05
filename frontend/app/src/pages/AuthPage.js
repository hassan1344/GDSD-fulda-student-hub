import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoFHB from "../assets/images/logoFHB.png";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userType: "Student", // Default to Student
  });

  const toggleForm = () => setIsRegister((prev) => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Determine the endpoint and action based on whether it's registration or login
    const isRegister =
      formData.userType === "Student" || formData.userType === "Landlord"; // check if registration form

    if (!isRegister) {
      // Simulating Registration Success
      console.log("Registration Successful", formData);
      alert("Registration successful! Please log in.");
      toggleForm(); // Toggle form between login and register
    } else {
      // Simulating Login Success
      const mockCredentials = {
        email: "student@informatik.hs-fulda.de", // Mock student email
        password: "password123", // Mock password
      };

      if (
        formData.email === mockCredentials.email &&
        formData.password === mockCredentials.password
      ) {
        alert("Login successful!");
        localStorage.setItem("isLoggedIn", "true"); // Simulate login success (this can be used to check if the user is logged in)
        navigate("/home"); // Redirect to Home (adjust the path as needed)
      } else {
        alert("Invalid email or password. Please try again.");
      }
    }
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     const endpoint = isRegister
  //       ? `/api/v1/auth/register?user=${formData.userType}`
  //       : `/api/v1/auth/login`;

  //     try {
  //       const response = await fetch(endpoint, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           email: formData.email,
  //           password: formData.password,
  //         }),
  //       });

  //       const data = await response.json();
  //       if (response.ok) {
  //         if (!isRegister) {
  //           localStorage.setItem("jwtToken", data.token); // Store JWT
  //           navigate("/home"); // Redirect to Home for students
  //         } else {
  //           alert("Registration successful! Please log in.");
  //           toggleForm();
  //         }
  //       } else {
  //         alert(data.message || "An error occurred. Please try again.");
  //       }
  //     } catch (error) {
  //       console.error("Error:", error);
  //       alert("Server error. Please try again later.");
  //     }
  //   };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-100 via-green-50 to-white">
      <div className="text-center mb-6">
        <img
          src={logoFHB}
          alt="Fulda Student Hub"
          className="w-24 mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-gray-800">
          {isRegister ? "Register" : "Login"}
        </h1>
        <p className="text-sm text-gray-500">
          {isRegister
            ? "Create an account to start using Fulda Student Hub"
            : "Welcome back! Please log in to continue."}
        </p>
      </div>
      <div className="bg-white shadow-lg rounded-lg w-96 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          )}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {isRegister && formData.userType === "Student" && (
              <p className="text-xs text-gray-500 mt-1">
                Students must use their @informatik.hs-fulda.de email.
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          {isRegister && (
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          )}
          {isRegister && (
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Registering As
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="Student">Student</option>
                <option value="Landlord">Landlord</option>
              </select>
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md transition-all duration-300"
            >
              {isRegister ? "Register" : "Login"}
            </button>
            <button
              type="button"
              onClick={toggleForm}
              className="text-sm text-gray-500 underline hover:text-gray-800"
            >
              {isRegister
                ? "Already have an account? Log in"
                : "Don't have an account? Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;

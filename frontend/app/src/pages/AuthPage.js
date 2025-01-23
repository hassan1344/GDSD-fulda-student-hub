import React, { useState } from "react";
import { replace, useNavigate } from "react-router-dom";
import logoFHB from "../assets/images/logoFHB.png";
import { registerUser, loginUser } from "../services/authServices";
import Disclaimer from "../components/Disclaimer";
import { jwtDecode } from "jwt-decode"; // Import the library

const AuthPage = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userType: "STUDENT",
    userName: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    visible: false,
  });

  const toggleForm = () => setIsRegister((prev) => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showNotification = (msg) => {
    setNotification({ message: msg, visible: true });
    setTimeout(() => setNotification({ message: "", visible: false }), 3000); // 3-second timer
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({}); // Reset field errors

    try {
      if (isRegister) {
        const { email, password, confirmPassword, userType, userName } =
          formData;

        const errors = {};

        if (!userName) errors.userName = "Username is required.";
        if (password !== confirmPassword)
          errors.confirmPassword = "Passwords do not match.";
        if (
          userType === "STUDENT" &&
          !email.includes("@informatik.hs-fulda.de")
        )
          errors.email = "Student email must include @informatik.hs-fulda.de.";

        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

        if (!passwordRegex.test(password))
          errors.password =
            "Password must have at least one number, one special character, one uppercase letter, and one lowercase letter.";

        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
          setLoading(false);
          return;
        }

        const response = await registerUser({
          email,
          password,
          userName,
          userType,
        });

        if (response?.message === "User registered successfully") {
          showNotification("Registration successful!");

          try {
            const responseL = await loginUser({ userName, password });

            if (responseL.tokens) {
              const { accessToken, refreshToken } = responseL.tokens;

              localStorage.setItem("accessToken", accessToken);
              localStorage.setItem("refreshToken", refreshToken);

              const decodedToken = jwtDecode(accessToken);
              const { userName, userType } = decodedToken;

              showNotification("Login successful...");
              if (userType === "STUDENT") {
                setTimeout(() => {
                  navigate('/profile', { state: { userType: "STUDENT", userName: {userName} } });
                }, 2000);
              } else if (userType === "LANDLORD") {
                setTimeout(() => {
                  navigate('/profile', { state: { userType: "LANDLORD", userName: {userName} } });
                }, 2000);
              }  else if (userType === "ADMIN") {
                setTimeout(() => {
                  navigate('/profile', { state: { userType: "ADMIN", userName: {userName} } });
                }, 2000);
              } else {
                showNotification("An error occurred. Please try again.");
              }
            } else {
              // Login failed
              showNotification("Login failed. Please try logging in again.");
            }
          } catch (error) {
            console.error("Login attempt error:", error);
            showNotification("An unexpected error occurred. Please try again.");
          }
        } else {
          // Registration failed
          showNotification("Registration failed. Please try again.");
        }
      } else {
        const { userName, password } = formData;

        const errors = {};
        if (!userName) errors.userName = "Username is required.";
        if (!password) errors.password = "Password is required.";

        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
          setLoading(false);
          return;
        }

        const response = await loginUser({ userName, password });

        console.log(response);

        if (response && response.tokens) {
          const { accessToken, refreshToken } = response.tokens;

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          const decodedToken = jwtDecode(accessToken);
          const { userName, userType } = decodedToken;

          console.log("usertype----", userType);

          showNotification("Login successful...");
          if (userType === "STUDENT") {
            setTimeout(() => {
              navigate("/home", { replace: true });
            }, 2000);
          } else if (userType === "LANDLORD") {
            setTimeout(() => {
              navigate("/landlord", { replace: true }); //Add landlord landing page
            }, 2000);
          } else if (userType === "ADMIN") {
            setTimeout(() => {
              navigate('/admin', { replace: true });
            }, 2000);
          } else {
            showNotification("An error occurred. Please try again.");
          }
        } else if (response?.data.error === "Invalid credentials") {
          showNotification("Invalid login credentials!");
          setFieldErrors({
            userName: "Invalid username or password.",
            password: "Invalid username or password.",
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        // Server responded with an error, like 401 Unauthorized
        if (
          error.response.status === 401 &&
          error.response.data?.error === "Invalid credentials."
        ) {
          showNotification("Invalid login credentials!");
          setFieldErrors({
            userName: "Invalid username or password.",
            password: "Invalid username or password.",
          });
        } else {
          showNotification("An error occurred. Please try again.");
        }
      } else {
        // Network or other issues not related to server response
        showNotification("Network error. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center background-container">
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

      {/* Notification Banner */}
      {notification.visible && (
        <div className="fixed top-4 bg-green-500 text-white py-2 px-4 rounded-md shadow-md transition-all duration-300">
          {notification.message}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg w-96 p-6 relative">
        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-green-500"></div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Username
            </label>
            <input
              type="text"
              name="userName"
              placeholder="Enter your username"
              value={formData.userName}
              onChange={handleInputChange}
              required
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                fieldErrors.userName
                  ? "border-red-500 ring-red-400"
                  : "border-gray-300 focus:ring-green-400"
              }`}
            />
            {fieldErrors.userName && (
              <p className="text-sm text-red-500 mt-1">
                {fieldErrors.userName}
              </p>
            )}
          </div>

          {isRegister && (
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
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  fieldErrors.email
                    ? "border-red-500 ring-red-400"
                    : "border-gray-300 focus:ring-green-400"
                }`}
              />
              {fieldErrors.email && (
                <p className="text-sm text-red-500 mt-1">{fieldErrors.email}</p>
              )}
            </div>
          )}

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
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                fieldErrors.password
                  ? "border-red-500 ring-red-400"
                  : "border-gray-300 focus:ring-green-400"
              }`}
            />
            {fieldErrors.password && (
              <p className="text-sm text-red-500 mt-1">
                {fieldErrors.password}
              </p>
            )}
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
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  fieldErrors.confirmPassword
                    ? "border-red-500 ring-red-400"
                    : "border-gray-300 focus:ring-green-400"
                }`}
              />
              {fieldErrors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                User Type
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="STUDENT">Student</option>
                <option value="LANDLORD">Landlord</option>
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

      <div className="pb-16"></div>

      <Disclaimer />
    </div>
  );
};

export default AuthPage;

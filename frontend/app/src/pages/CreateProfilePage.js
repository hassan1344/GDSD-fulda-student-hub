import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createProfile } from "../services/profileServices";

const CreateProfilePage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const userType = state?.userType;
  const userName = state?.userName;
  const accessToken = localStorage.getItem("accessToken"); // Access token passed from registration or login

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    ...(userType === "STUDENT"
      ? { university: "", studentIdNumber: "" }
      : { address: "" }),
  });

  const [notification, setNotification] = useState({
    message: "",
    visible: false,
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showNotification = (msg) => {
    setNotification({ message: msg, visible: true });
    setTimeout(() => setNotification({ message: "", visible: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        userName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        ...(userType === "STUDENT"
          ? {
              university: formData.university,
              studentIdNumber: formData.studentIdNumber,
              emailVerified: true,
            }
          : { address: formData.address, trustScore: 0 }), // Default trustScore for landlords
      };

      console.log(payload, accessToken);

      await createProfile(payload, accessToken); // Pass accessToken to the service

      showNotification("Profile created successfully!");
      setTimeout(() => {
        if (userType === "STUDENT") {
          navigate("/Home", {replace: true});
        } else if (userType === "LANDLORD") {
          navigate("/landlord", {replace: true});
        }
      }, 2000); // Redirect after success
    } catch (error) {
      console.error("Error creating profile:", error);
      showNotification("Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center background-container">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Create Profile</h1>
        <p className="text-sm text-gray-500">
          Please fill out your profile information to proceed.
        </p>
      </div>

      {notification.visible && (
        <div className="fixed top-4 bg-green-500 text-white py-2 px-4 rounded-md shadow-md">
          {notification.message}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg w-96 p-6 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-green-500"></div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {userType === "STUDENT" && (
            <>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  University
                </label>
                <input
                  type="text"
                  name="university"
                  placeholder="Enter your university"
                  value={formData.university}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Student ID
                </label>
                <input
                  type="text"
                  name="studentIdNumber"
                  placeholder="Enter your student ID"
                  value={formData.studentIdNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </>
          )}

          {userType === "LANDLORD" && (
            <>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md transition-all duration-300 w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfilePage;

import React, { useEffect, useState } from "react";
import { getProfileByUsername } from "../services/profileServices"; // Adjust the import based on your structure
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/NavBar";
import Disclaimer from "../components/Disclaimer";

const ViewStudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUserName] = useState("");

  // Fetch profile data
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const decodedToken = jwtDecode(accessToken);
    const { userName, userType } = decodedToken;

    setUserName(userName);

    if (userName) {
    }

    if (userName) {
      const fetchProfile = async () => {
        try {
          const data = await getProfileByUsername(userName);
          console.log("Data in fetchProfile", data.user_id);
          setProfile(data);
        } catch (err) {
          setError("Error loading profile: " + err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    } else {
      setError("Username is not valid.");
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="background-container">
      {/* Navbar */}
      <Navbar />

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
        {/* Profile Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-700">Student Profile</h1>
          <p className="text-sm text-gray-500">
            Welcome to the Fulda Student Hub
          </p>
        </div>

        {/* Profile Content */}
        <div className="space-y-4">
          {/* Profile Picture */}
          <div className="flex justify-center mb-4">
            {profile?.Media ? (
              <img
                src={`https://fulda-student-hub.s3.eu-north-1.amazonaws.com/public/uploads/images/${profile.Media[0]?.mediaUrl}`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover shadow-md"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center shadow-md">
                <span className="text-gray-500 text-3xl">👤</span>
              </div>
            )}
          </div>

          {/* Name & Info */}
          <div className="text-center space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">
              {profile?.first_name} {profile?.last_name}
            </h2>
            <p className="text-sm text-gray-600">{profile?.university}</p>
            <p className="text-sm text-gray-600">
              Student ID: {profile?.student_id_number}
            </p>
            <p className="text-sm text-gray-600">Email: {profile?.email}</p>
          </div>

          {/* Contact Info Section */}
          <div className="border-t pt-4 space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Phone:</strong> {profile?.phone_number || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Username:</strong> {profile?.user_id || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
};

export default ViewStudentProfile;

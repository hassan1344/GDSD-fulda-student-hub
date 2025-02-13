import React, { useState, useEffect } from "react";
import { getApplicationByID, updateApplicationStatus } from "../services/applicationServices";
import Navbar from "../components/NavBar";
import Disclaimer from "./Disclaimer";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApplicationDetails = ({ applicationId, onBack }) => {
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const accessToken = localStorage.getItem("accessToken");
  const decodedToken = jwtDecode(accessToken);
  const { userType } = decodedToken;

  // Handle request action (approve/reject)
  const handleRequestAction = async (status) => {
    const body = { application_status: status };
    try {
      await updateApplicationStatus(applicationId, body);
      // After successful update, refetch or update the application status
      setApplication((prevApplication) => ({
        ...prevApplication,
        application_status: status,
      }));

      // Show success toast notification
      toast.success(`Application updated successfully!`, {
        autoClose: 2000,
        position: "top-right",
      });

    } catch (error) {
      setError("Failed to update application status.");
      // Show error toast notification
      toast.error("Failed to update application status.", {
        autoClose: 2000,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getApplicationByID(applicationId, userType);
        setApplication(data);
      } catch (error) {
        console.error("Error loading applications:", error);
        setError("Failed to load application details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (applicationId) fetchApplications();
  }, [applicationId]);

  if (isLoading) {
    return (
      <p className="text-center text-gray-600 mt-6">
        Loading application details...
      </p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-6">{error}</p>;
  }

  if (!application) {
    return (
      <p className="text-center text-gray-500 mt-6">
        No application details available.
      </p>
    );
  }

  return (
    <div className="background-container">
      {userType === "STUDENT" && <Navbar />}
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-md transition-all duration-200"
          >
            Back to Applications
          </button>
          {userType === "LANDLORD" && application.application_status === "PENDING" &&
            <div className="space-x-4">
              <button
                onClick={() => handleRequestAction("APPROVED")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => handleRequestAction("REJECTED")}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          }
        </div>
        <br></br>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex justify-between items-center">
          Application Details
          <span className="text-3xl font-bold text-gray-700">
            Status: {application.application_status || "N/A"}
          </span>
        </h2>



        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700">
            Application Info
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
            <p>
              <span className="font-semibold">Application ID:</span>{" "}
              {application.application_id || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Student Name:</span>{" "}
              {application.full_name || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Contact Number:</span>{" "}
              {application.contact_number || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Address:</span>{" "}
              {application.current_address || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Applied At:</span>{" "}
              {application.applied_at
                ? new Date(application.applied_at).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700">Listing Details</h3>
          <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
            <p>
              <span className="font-semibold">Property Title:</span>{" "}
              {application.listing?.title || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Rent:</span> €
              {application.listing?.rent || "N/A"}
            </p>
            <p className="col-span-2">
              <span className="font-semibold">Description:</span>{" "}
              {application.listing?.description || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {application.listing?.status || "N/A"}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700">Media Files</h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {application.media?.length > 0 ? (
              application.media.map((item) => (
                <div
                  key={item.media_id}
                  className="relative border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
                >
                  {item.media_url.includes("pdf") ? (
                    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 h-48">
                      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="white"
                          className="w-8 h-8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.25 2.25h-4.5a2.25 2.25 0 00-2.25 2.25v15a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-11.25l-3.75-3.75z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.25 2.25V6h3.75"
                          />
                        </svg>
                      </div>
                      <a
                        href={`https://fulda-student-hub.s3.eu-north-1.amazonaws.com/public/uploads/images/${item.media_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-semibold underline text-sm"
                      >
                        View {item.media_type} File
                      </a>
                    </div>
                  ) : (
                    <div className="relative h-48 bg-gray-50">
                      <a
                        href={`https://fulda-student-hub.s3.eu-north-1.amazonaws.com/public/uploads/images/${item.media_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-semibold underline text-sm"
                      >
                        <img
                          src={`https://fulda-student-hub.s3.eu-north-1.amazonaws.com/public/uploads/images/${item.media_url}`}
                          alt={item.media_type}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 w-full bg-gray-900 bg-opacity-50 text-white text-sm py-2 px-4">
                          {item.media_type}
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No media available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;

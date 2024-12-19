import React, { useState, useEffect } from "react";
import { getApplicationByID } from "../services/applicationServices";
import Navbar from "../components/NavBar";

const ApplicationDetails = ({ applicationId, onBack }) => {
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getApplicationByID(applicationId);
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
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Application Details
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
              <span className="font-semibold">Application Status:</span>{" "}
              {application.application_status || "N/A"}
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
          <div className="mt-2">
            {application.media?.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {application.media.map((item) => (
                  <div
                    key={item.media_id}
                    className="media-item border rounded-lg p-4 bg-gray-100"
                  >
                    {item.media_url.includes("pdf") ? (
                      <a
                        href={`https://fulda-student-hub.s3.eu-north-1.amazonaws.com/public/uploads/images/${item.media_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View {item.media_type} file
                      </a>
                    ) : (
                      <div>
                        <img
                          src={`https://fulda-student-hub.s3.eu-north-1.amazonaws.com/public/uploads/images/${item.media_url}`}
                          alt={item.media_category}
                          className="rounded-md w-full object-cover max-h-48"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          {item.media_type}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No media available</p>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-md transition-all duration-200"
          >
            Back to Applications
          </button>
        </div>

        <div className="mt-8">
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;

import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ApplicationCard from "../../components/ApplicationCard";
import Navbar from "../../components/NavBar";
import Disclaimer from "../../components/Disclaimer";
import { getAllApplications } from "../../services/applicationServices";
import { getRoomTypeById } from "../../services/utilServices";
import ApplicationDetails from "../../components/ApplicationDetails";

const ViewApplicationStudent = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getAllApplications();

        const applicationsWithRoomTypeNames = await Promise.all(
          data.map(async (application) => {
            const roomTypeData = await getRoomTypeById(application.listing.room_type_id);
            return {
              ...application,
              roomTypeName: roomTypeData ? roomTypeData.room_type_name : "Unknown Room Type",
            };
          })
        );

        setApplications(applicationsWithRoomTypeNames);
      } catch (error) {
        console.error("Error loading applications:", error);
        setError("Failed to load applications.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (selectedApplicationId) {
    return (
      <ApplicationDetails
        applicationId={selectedApplicationId}
        onBack={() => setSelectedApplicationId(null)}
      />
    );
  }

  return (
    <div className="background-container">
      <Navbar />

      <div className="p-8">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Your Applications</h1>
          <p className="text-gray-500 mt-2 text-sm">Manage your housing applications here</p>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center mt-12">
            <div className="text-gray-700 text-lg">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center mt-12">
            <div className="text-center bg-white shadow-lg p-8 rounded-lg max-w-sm">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Error</h2>
              <p className="text-sm text-gray-500 mb-4 leading-snug">{error}</p>
            </div>
          </div>
        ) : applications.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {applications.map((application) => (
              <ApplicationCard
                key={application.application_id}
                application_id={application.application_id}
                application_status={application.application_status}
                appliedAt={application.applied_at}
                title={application.listing.title}
                description={application.listing.description}
                roomType={application.roomTypeName}
                rent={application.listing.rent}
                onViewDetails={(id) => setSelectedApplicationId(id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center mt-12">
            <div className="text-center bg-white shadow-lg p-8 rounded-lg max-w-sm">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">No Applications Found</h2>
              <p className="text-sm text-gray-500 mb-4 leading-snug">
                You don't have any applications yet. Apply now to start your journey!
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ViewApplicationStudent;

import React, { useState, useEffect } from "react"; // Import useState
import ApplicationDetails from "./ApplicationDetails";

const ApplicationCard = ({
  application_id,
  application_status,
  appliedAt,
  title,
  description,
  roomType,
  rent,
  onViewDetails
}) => {
  const [selectedApplicationId, setSelectedApplicationId] = useState();

  return (
    <div className="flex flex-col bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">
          {new Date(appliedAt).toLocaleDateString()}
        </p>
        <span
          className={`px-3 py-1 text-sm font-semibold rounded-full ${
            application_status == "PENDING"
              ? "bg-yellow-200 text-yellow-700"
              : application_status == "ACCEPTED"
              ? "bg-green-200 text-green-700"
              : "bg-red-200 text-red-700"
          } transition-all duration-300`}
        >
          {application_status}
        </span>
      </div>
      {/* Main Info Section */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">
        {title}
      </h2>
      <p className="text-sm text-gray-600 mb-4 leading-snug">{description}</p>
      {/* Room & Rent Info */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
        <p>
          <span className="font-semibold">Room Type:</span> {roomType}
        </p>
        <p>
          <span className="font-semibold">Rent:</span> €{rent}
        </p>
      </div>

      <button
        onClick={() => onViewDetails(application_id)}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-300 shadow-md"
      >
        View Application Details
      </button>

    </div>
  );
};

export default ApplicationCard;

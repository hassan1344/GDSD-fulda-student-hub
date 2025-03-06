import React, { useEffect, useState } from 'react';
import LandlordNavbar from '../../components/LandlordNavbar';
import { getAllApplicationsByLandlord, updateApplicationStatus } from '../../services/applicationServices';
import ApplicationDetails from '../../components/ApplicationDetails';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";

const LandlordSelectRequests = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      const data = await getAllApplicationsByLandlord();
      if (data.success) {
        setApplications(data.data);
      } else {
        setError(data.message || 'Failed to fetch applications');
      }
    } catch (error) {
      setError('Error fetching applications. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAction = async (status, applicationId) => {
    const body = { application_status: status };
    try {
      await updateApplicationStatus(applicationId, body);

      // Show success toast notification
      toast.success(`Application updated successfully!`, {
        autoClose: 2000,
        position: "top-right",
      });

      // Update the status of the application in the state without reloading
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.application_id === applicationId
            ? { ...app, application_status: status }
            : app
        )
      );
    } catch (error) {
      // Show error toast notification
      toast.error("Failed to update application status.", {
        autoClose: 2000,
        position: "top-right",
      });
    }
  };

  const handleGenerateLease = (request) => {
    navigate('/landlord/lease-agreement', {
      state: {
        applicationId: request.application_id,
        tenantName: request.full_name,
        landlordName: "Your Name Here", // Replace with actual landlord's name
        rentAmount: request.listing?.rent_amount || "N/A",
        startDate: new Date().toISOString().split('T')[0], // Default to today
        endDate: "YYYY-MM-DD", // Placeholder
        propertyAddress: request.listing?.address || "Unknown Address",
      }
    });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleBack = () => {
    setSelectedApplicationId(null);
    fetchApplications(); // Refresh the applications list when navigating back
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-2xl text-green-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-2xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="background-container">
      <LandlordNavbar />
      <div className="p-8">
        {selectedApplicationId ? (
          <ApplicationDetails
            applicationId={selectedApplicationId}
            onBack={handleBack} />
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Suitable Requests</h2>

            <div className="grid grid-cols-1 gap-6">
              {applications.length > 0 ? (
                applications.map((request) => (
                  <div key={request.application_id} className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{request.full_name || 'Unknown Tenant'}</h3>
                    <p className="text-gray-600 font-semibold">{request.listing?.title || 'No Property Title'}</p>
                    <p className="text-gray-600">Request Date: {new Date(request.created_at).toLocaleDateString()}</p>
                    <p className="text-gray-600">Status: <span className="font-bold">{request.application_status}</span></p>
                    <div className="mt-4 flex space-x-4">
                      {request.application_status === "PENDING" && (
                        <div className="space-x-4">
                          <button
                            onClick={() => handleRequestAction("APPROVED", request.application_id)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRequestAction("REJECTED", request.application_id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => setSelectedApplicationId(request.application_id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        View Application
                      </button>
                      <button
                        onClick={() => handleGenerateLease(request)}
                        className={`bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 ${request.application_status !== "APPROVED" ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={request.application_status !== "APPROVED"}
                      >
                        Generate Lease
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No applications found.</p>
              )}
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default LandlordSelectRequests;

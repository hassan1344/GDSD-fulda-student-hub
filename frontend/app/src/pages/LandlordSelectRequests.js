import React, { useState } from 'react';
import Navbar from '../components/NavBar';

const LandlordSelectRequests = () => {
  // Mock data for pending requests
  const [requests, setRequests] = useState([
    {
      id: 1,
      propertyTitle: "Modern Apartment",
      tenantName: "Alice Johnson",
      date: "2024-01-15"
    },
    {
      id: 2,
      propertyTitle: "Cozy Studio",
      tenantName: "Bob Smith",
      date: "2024-02-01"
    },
    {
      id: 3,
      propertyTitle: "Spacious House",
      tenantName: "Charlie Brown",
      date: "2024-01-20"
    }
  ]);

  const handleRequestAction = (requestId, action) => {
    // In a real application, this would send a request to the backend
    // Here, we'll just remove the request from the list
    setRequests(requests.filter(request => request.id !== requestId));
    console.log(`Request ${requestId} ${action}d`);
  };

  // Debugging step to verify requests state
  console.log("Current requests:", requests);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Suitable Requests</h2>
        
        <div className="grid grid-cols-1 gap-6">
          {requests.map((request) => (
            <div key={request.id} className="bg-white shadow-md rounded-lg p-6">
              {/* Highlight tenant name */}
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{request.tenantName}</h3>
              {/* Property title as secondary information */}
              <p className="text-gray-600 font-semibold">{request.propertyTitle}</p>
              {/* Display the request date */}
              <p className="text-gray-600">Request Date: {new Date(request.date).toLocaleDateString()}</p>
              <div className="mt-4 flex space-x-4">
                <button 
                  onClick={() => handleRequestAction(request.id, 'approve')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleRequestAction(request.id, 'reject')}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandlordSelectRequests;

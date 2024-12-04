import React, { useState } from 'react';
import Navbar from '../components/NavBar';

const LandlordRequests = () => {
  const [filters, setFilters] = useState({
    status: 'all',
    propertyType: 'all',
    dateRange: 'all'
  });

  // Mock data for requests
  const mockRequests = [
    {
      id: 1,
      propertyTitle: "Modern Apartment",
      status: "pending",
      tenantName: "Alice Johnson",
      date: "2024-01-15",
      propertyType: "apartment"
    },
    {
      id: 2,
      propertyTitle: "Cozy Studio",
      status: "approved",
      tenantName: "Bob Smith",
      date: "2024-02-01",
      propertyType: "studio"
    },
    {
      id: 3,
      propertyTitle: "Spacious House",
      status: "rejected",
      tenantName: "Charlie Brown",
      date: "2024-01-20",
      propertyType: "house"
    }
  ];

  const filteredRequests = mockRequests.filter(request => {
    return (filters.status === 'all' || request.status === filters.status) &&
           (filters.propertyType === 'all' || request.propertyType === filters.propertyType);
    // Note: Date range filter is not implemented in this mock version
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  console.log("LandlordRequests rendered", filters);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">View Requests</h2>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Filters:</h3>
          <div className="grid grid-cols-3 gap-4">
            <select name="status" onChange={handleFilterChange} className="p-2 border rounded">
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select name="propertyType" onChange={handleFilterChange} className="p-2 border rounded">
              <option value="all">All Property Types</option>
              <option value="apartment">Apartment</option>
              <option value="studio">Studio</option>
              <option value="house">House</option>
            </select>
            <select name="dateRange" onChange={handleFilterChange} className="p-2 border rounded">
              <option value="all">All Dates</option>
              <option value="lastWeek">Last Week</option>
              <option value="lastMonth">Last Month</option>
              <option value="lastYear">Last Year</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredRequests.map((request) => (
            <div key={request.id} className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">{request.propertyTitle}</h3>
              <p className="text-gray-600">Status: {request.status}</p>
              <p className="text-gray-600">Tenant: {request.tenantName}</p>
              <p className="text-gray-600">Date: {new Date(request.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandlordRequests;
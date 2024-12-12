import React from 'react';
import { useLocation } from 'react-router-dom';

const ViewPropertyDetails = () => {
  const location = useLocation();
  const { property } = location.state || {};

  if (!property) {
    return <div>No property details available.</div>;
  }

  return (
    <div className="min-h-screen bg-green-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-green-700 mb-6">
          Property Details
        </h1>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-xl font-semibold">Address: {property.address}</h2>
          <p>Rent: €{property.rent}</p>
          <p>Amenities: {property.amenities.join(', ')}</p>
          <p>Landlord Name: {property.landlord.first_name} {property.landlord.last_name}</p>
          <p>Landlord Phone: {property.landlord.phone_number}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewPropertyDetails;

import React from 'react';
import Navbar from '../components/NavBar';

const LandlordViewProperties = () => {
  // Mock data for properties
  const properties = [
    {
      id: 1,
      title: "Modern Apartment",
      address: "123 Main Street",
      type: "Apartment",
      rent: 1200,
      status: "Occupied",
      image: "https://picsum.photos/200/300"
    },
    {
      id: 2,
      title: "Cozy Studio",
      address: "456 Elm Street",
      type: "Studio",
      rent: 900,
      status: "Available",
      image: "https://picsum.photos/200/301"
    },
    {
      id: 3,
      title: "Spacious House",
      address: "789 Oak Avenue",
      type: "House",
      rent: 2000,
      status: "Under Maintenance",
      image: "https://picsum.photos/200/302"
    }
  ];

  // Debugging: Verify properties data
  console.log("Rendering properties:", properties);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">View Properties</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img src={property.image} alt={property.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                <p className="text-gray-600">Address: {property.address}</p>
                <p className="text-gray-600">Type: {property.type}</p>
                <p className="text-gray-600">Rent: €{property.rent}</p>
                <p className="text-gray-600">Status: {property.status}</p>
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Edit Property
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandlordViewProperties;

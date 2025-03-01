/* View Property */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandlordNavbar from '../../components/LandlordNavbar';
import { fetchAllProperties, deleteProperty, fetchPropertyById } from '../../services/LandlordServices';

const ViewProperties = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // View details of a specific property
  const viewPropertyById = async (propertyId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const data = await fetchPropertyById(propertyId, token);
      if (data.success) {
        navigate(`/landlord/view-property/${propertyId}`, {
          state: { property: data.data },
        });
      } else {
        console.error('Error fetching property details:', data.message);
      }
    } catch (err) {
      console.error('Error fetching property details:', err);
    }
  };

  // Delete a property
  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const response = await deleteProperty(propertyId);
        if (response.success) {
          setProperties((prev) =>
            prev.filter((prop) => prop.property_id !== propertyId)
          );
        } else {
          setError(response.message || 'Failed to delete property');
        }
      } catch (err) {
        console.error('Error deleting property:', err);
        setError('Error deleting property');
      }
    }
  };

  // Fetch all properties on mount
  useEffect(() => {
    const fetchProperties = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const data = await fetchAllProperties(token);
        if (data.success) {
          setProperties(data.data);
        } else {
          setError(data.message || 'Failed to fetch properties');
        }
      } catch (err) {
        setError('Error fetching properties. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

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
    <div className="min-h-screen bg-green-50">
      <LandlordNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-green-700 mb-6">
          My Properties
        </h1>

        {properties.length === 0 ? (
          <p className="text-center text-gray-600">
            No properties available.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property.property_id}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
              >
                {/* Property Image */}
                {property.media && property.media.length > 0 && (
                  <div className="relative h-48">
                    <img
                      src={`https://fulda-student-hub.s3.eu-north-1.amazonaws.com/public/uploads/images/${property.media[0].media_url}`}
                      alt={property.address}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                )}

                {/* Property Info */}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-green-700 mb-3">
                    {property.address}
                  </h2>
                  {property.property_amenity &&
                    property.property_amenity.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {property.property_amenity.map((pa) => (
                          <span
                            key={pa.property_amenity_id}
                            className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                          >
                            {pa.amenity.amenity_name}
                          </span>
                        ))}
                      </div>
                    )}

                  {/* Buttons */}
                  <div className="flex gap-2 mt-3">
                    {/* Edit */}
                    <button
                      onClick={() =>
                        navigate(`/landlord/edit-listing/${property.property_id}`)
                      }
                      className="flex-1 px-3 py-2 text-white font-medium text-sm rounded-md bg-green-600 hover:bg-green-700 transition-colors"
                    >
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(property.property_id)}
                      className="flex-1 px-3 py-2 text-white font-medium text-sm rounded-md bg-red-600 hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>

                    {/* Blockchain Payment */}
                    <div className="relative flex-1">
                      <button
                        onClick={() =>
                          navigate(`/landlord/blockchain/${property.property_id}`)
                        }
                        className="w-full px-3 py-2 text-white font-medium text-sm rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        BlockchainTx
                      </button>
                      {/* HOT badge with bounce animation */}
                      <span className="absolute top-0 right-0 -mt-2 -mr-2 text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-full animate-bounce">
                        HOT
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProperties;

/* View Property */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandlordNavbar from '../../components/LandlordNavbar';
import { fetchAllProperties, fetchPropertyById } from '../../services/LandlordServices';

/*  State to manage the properties list, loading status, and error messages */
const ViewProperties = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

/* Function to view a property by ID and navigate to the details page */
  const viewPropertyById = async (propertyId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const data = await fetchPropertyById(propertyId, token);
      if (data.success) {
        navigate(`/landlord/view-property/${propertyId}`, { state: { property: data.data } });
      } else {
        console.error('Error fetching property details:', data.message);
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
    }
  };

/* Function to handle deleting a property by ID  */
  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const token = localStorage.getItem('accessToken');
/* API call to delete the property from DB*/
        const response = await fetch(`https://fulda-student-hub.publicvm.com/api/v1/propertiesModule/${propertyId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`   //Token for authorization
          }
        });

        const data = await response.json();
        if (data.success) {
          setProperties(properties.filter(prop => prop.property_id !== propertyId));
        } else {
          setError('Failed to delete property');
        }
      } catch (error) {
        setError('Error deleting property');
      }
    }
  };

  /* useEffect hook to fetch all properties when the component is mounted */
  useEffect(() => {
    const fetchProperties = async () => {
      const token = localStorage.getItem('accessToken');  //got access token
      try {
        const data = await fetchAllProperties(token);  //will get properties on success
        if (data.success) {
          setProperties(data.data);
        } else {
          setError(data.message || 'Failed to fetch properties');
        }
      } catch (error) {
        setError('Error fetching properties. Please try again later.');
      } finally {
        setIsLoading(false);    //break loading process
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
        <h1 className="text-4xl font-bold text-center text-green-700 mb-6">My Properties</h1>
        {properties.length === 0 ? (
          <p className="text-center text-gray-600">No properties available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <div key={property.property_id} className="bg-white shadow-lg rounded-lg overflow-hidden">
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
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-green-700 mb-3">
                    {property.address}
                  </h2>
                  
                  {property.property_amenity && property.property_amenity.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {property.property_amenity.map((pa) => (
                          <span 
                            key={pa.property_amenity_id}
                            className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                          >
                            {pa.amenity.amenity_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/landlord/edit-listing/${property.property_id}`)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                      Edit Property
                    </button>
                    <button
                      onClick={() => handleDelete(property.property_id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                      Delete Property
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );};

export default ViewProperties;

//import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
//import { mockLandlordData } from '../../mockData'; // Import mock data
import LandlordNavbar from '../../components/LandlordNavbar'; // Adjusted path to Navbar component
import { fetchAllProperties, fetchPropertyById } from '../../services/LandlordServices';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ViewProperties = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const viewPropertyById = async (propertyId) => {

    try {
      const token = localStorage.getItem('accessToken');
      const data = await fetchPropertyById(propertyId, token);
      if (data.success) {
        // Navigate to a new page or display the property details
        navigate(`/landlord/view-property/${propertyId}`, { state: { property: data.data } });
      } else {
        console.error('Error fetching property details:', data.message);
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
    }
  };

  useEffect(() => {
    const fetchListings = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const data = await fetchAllProperties(token);
        if (data.success) {
          setListings(data.data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Error fetching listings. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);
  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-green-50">
      <LandlordNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-green-700 mb-6">View Properties</h1>
        {listings.length === 0 ? (
          <p className="text-center text-gray-600">No listings available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <div key={listing.property_id} className="bg-white shadow-lg rounded-lg overflow-hidden">

                <div className="p-4">
                  <h2 className="text-xl font-semibold text-green-700 cursor-pointer hover:underline">{listing.address}</h2>

                  <p className="text-lg font-bold text-green-600">Rent: €{listing.rent}</p>
                  <p className="text-sm text-gray-500">Amenities: {listing.amenities.join(', ')}</p>
                  <Link to={`/landlord/edit-listing/${listing.property_id}`} className="property-card-button">
                    Edit Property
                  </Link>
                  <button className="property-card-button" 
                  onClick={() => viewPropertyById(listing.property_id)}>
                    View Property
                  </button>

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



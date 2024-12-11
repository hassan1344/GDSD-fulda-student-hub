//import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
//import { mockLandlordData } from '../../mockData'; // Import mock data
import LandlordNavbar from '../../components/LandlordNavbar'; // Adjusted path to Navbar component
import { fetchAllProperties } from '../../services/LandlordServices';
import { Link } from 'react-router-dom';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


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
        <h1 className="text-4xl font-bold text-center text-green-700 mb-6">My Listings</h1>
        {listings.length === 0 ? (
          <p className="text-center text-gray-600">No listings available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <div key={listing.property_id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-green-700">{listing.address}</h2>
                  <p className="text-lg font-bold text-green-600">Rent: €{listing.rent}</p>
                  <p className="text-sm text-gray-500">Amenities: {listing.amenities.join(', ')}</p>
                  <Link to={`/landlord/edit-listing/${listing.property_id}`} className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                    Edit Listing
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;
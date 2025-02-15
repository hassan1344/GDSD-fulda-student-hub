/* Listings of a property */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandlordNavbar from '../../components/LandlordNavbar';
import { fetchAllListings, deleteListing } from '../../services/ListingServices';

const ViewListings = () => {
  // State variables
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  /* Deletes a listing by ID after user confirmation */
  const handleDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        const response = await deleteListing(listingId);
        if (response.success) {
          setListings(listings.filter((listing) => listing.listing_id !== listingId));
        } else {
          setError(response.message || 'Failed to delete listing');
        }
      } catch (error) {
        console.error('Error deleting listing:', error);
        setError('Error deleting listing');
      }
    }
  };


  /* Fetches all listings when the component mounts */
  useEffect(() => {
    const fetchListings = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const data = await fetchAllListings();
        if (data.success) {
          setListings(data.data);
        } else {
          setError(data.message || 'Failed to fetch listings');
        }
      } catch (error) {
        setError('Error fetching listings. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);

  //loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-2xl text-green-700">Loading...</div>
      </div>
    );
  }
  //error state
  if (error) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-2xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 relative z-0">
      <LandlordNavbar />
      <div className="container mx-auto px-4 py-8 relative z-0">
        <div className="flex flex-col items-center mb-12">
          <div className="relative group">
            <h1 className="text-5xl font-bold text-green-700 mb-4 relative z-10">
              My Listings
            </h1>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-green-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
          </div>
          <div className="bg-white px-6 py-2 rounded-full shadow-md mb-8">
            <span className="text-lg text-gray-600 font-medium">
              Total Listings: {listings.length}
            </span>
          </div>

          <button
            onClick={() => navigate('/landlord/create-prop-listing')}
            className="bg-green-600 hover:bg-green-700 text-white text-xl font-semibold px-8 py-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Create New Listing
          </button>
        </div>

        {listings.length === 0 ? (
          <div className="text-center bg-white rounded-lg shadow-md p-8">
            <p className="text-xl text-gray-600">No listings available.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Awaiting Approval Section */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-yellow-700 mb-4">Awaiting Approval</h2>
              {listings
                .filter((listing) => listing.status !== "Available")
                .map((listing) => (
                  <div key={listing.listing_id} className="bg-white shadow-lg rounded-lg overflow-hidden mb-6 p-6">
                    {/* Image Section */}
                    {listing.media && listing.media.length > 0 ? (
                      <img
                        src={`https://fulda-student-hub.s3.eu-north-1.amazonaws.com/public/uploads/images/${listing.media[0].media_url}`}
                        alt={listing.title}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg mb-4 p-6">
                        <span className="text-gray-400 text-lg">No image available</span>
                      </div>
                    )}

                    {/* Title & Description */}
                    <h3 className="text-xl font-bold text-yellow-800 mb-2">{listing.title}</h3>
                    <p className="text-lg text-gray-700 mb-4">{listing.description}</p>

                    {/* Buttons for Edit and Delete */}
                    <div className="flex flex-wrap gap-4 mt-4 justify-start">
                      <button
                        onClick={() => navigate(`/landlord/edit-prop-listing/${listing.listing_id}`)}
                        className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-md font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                      >
                        Edit Listing
                      </button>
                      <button
                        onClick={() => handleDelete(listing.listing_id)}
                        className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-md font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                      >
                        Delete Listing
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Approved Listings Section */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-green-700 mt-8 mb-4">Approved Listings</h2>
              {listings
                .filter((listing) => listing.status === "Available")
                .map((listing) => (
                  <div key={listing.listing_id} className="bg-white shadow-lg rounded-lg overflow-hidden mb-6 p-6">
                    {/* Image Section */}
                    {listing.media && listing.media.length > 0 ? (
                      <img
                        src={`https://fulda-student-hub.s3.eu-north-1.amazonaws.com/public/uploads/images/${listing.media[0].media_url}`}
                        alt={listing.title}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg mb-4 p-6">
                        <span className="text-gray-400 text-lg">No image available</span>
                      </div>
                    )}

                    {/* Title & Description */}
                    <h3 className="text-xl font-bold text-green-800 mb-2">{listing.title}</h3>
                    <p className="text-lg text-gray-700 mb-4">{listing.description}</p>

                    {/* Buttons for Edit, Delete, and Start Bidding */}
                    <div className="flex flex-wrap gap-4 mt-4 justify-start">
                      <button
                        onClick={() => navigate(`/landlord/edit-prop-listing/${listing.listing_id}`)}
                        className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-md font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                      >
                        Edit Listing
                      </button>
                      <button
                        onClick={() => handleDelete(listing.listing_id)}
                        className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-md font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                      >
                        Delete Listing
                      </button>
                      <button
                        onClick={() => navigate(`/bidding/BiddingLandlord/${listing.listing_id}`)}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-md font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                      >
                        Start Bidding
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default ViewListings;

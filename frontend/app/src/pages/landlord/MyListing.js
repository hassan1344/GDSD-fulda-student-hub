import React, { useState } from 'react';
import { mockLandlordData } from '../../mockData'; // Import mock data
import LandlordNavbar from '../../components/LandlordNavbar'; // Adjusted path to Navbar component

const MyListings = () => {
  const [listings] = useState(mockLandlordData.listings);

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
              <div key={listing.listing_id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                <img src={listing.images[0]} alt={listing.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-green-700">{listing.title}</h2>
                  <p className="text-gray-600 mb-2">{listing.description}</p>
                  <p className="text-lg font-bold text-green-600">Rent Price: €{listing.property.rent}</p>
                  <p className="text-sm text-gray-500">Status: {listing.status}</p>
                  <a href={`/landlord/edit-listing/${listing.listing_id}`} className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                    Edit Listing
                  </a>
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
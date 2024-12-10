import React, { useState } from 'react';
import { mockLandlordData } from '../../mockData';
import './MyListings.css'; // Import the CSS file
import NavBar from '../../components/NavBar'; // Adjusted path to Navbar component

const MyListings = () => {
  const [listings] = useState(mockLandlordData.listings);

  return (
    <div>
      <NavBar /> {}

    <div className="my-listings-container">
      <h1 className="listings-title">My Listings</h1>
      {listings.length === 0 ? (
        <p>No listings available.</p>
      ) : (
        listings.map(listing => (
          <div key={listing.listing_id} className="listing-card">
            <div className="listing-content">
              <img src={listing.images[0]} alt={listing.title} className="listing-image" />
              <div className="listing-details">
                <h2 className="listing-title">{listing.title}</h2>
                <p className="listing-description">{listing.description}</p>
                <p className="listing-rent">Rent Price: €{listing.property.rent}</p>
                <p className="listing-status">Status: {listing.status}</p>
                <a href={`/landlord/edit-listing/${listing.listing_id}`} className="edit-link">Edit Listing</a>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
    </div>
  );
};

export default MyListings;
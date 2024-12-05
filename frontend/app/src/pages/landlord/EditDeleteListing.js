import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockLandlordData } from '../../mockData'; // Import mock data
import './EditListing.css'; // Import the CSS file
import NavBar from '../../components/NavBar'; // Adjusted path to Navbar component
const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the listing to edit
  const listingToEdit = mockLandlordData.listings.find(listing => listing.listing_id === parseInt(id));
  
  const [listing, setListing] = useState(listingToEdit);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Update the existing listing in mock data
    const index = mockLandlordData.listings.findIndex(list => list.listing_id === listing.listing_id);
    
    if (index !== -1) {
      mockLandlordData.listings[index] = {
        ...listing,
        updated_at: new Date().toISOString() // Update the timestamp
      };
    }

    console.log("Updated Listing:", listing);

    // Navigate back to My Listings after submission
    navigate('/landlord/my-listings');
  };

  if (!listing) {
    return <div className="not-found">Listing not found!</div>;
  }

  return (
    <div>
      <NavBar /> {}
    <div className="edit-listing-container">
      <h1 className="edit-title">Edit Listing</h1>
      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label>Title:</label>
          <input 
            type="text" 
            value={listing.title} 
            onChange={(e) => setListing({ ...listing, title: e.target.value })} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea 
            value={listing.description} 
            onChange={(e) => setListing({ ...listing, description: e.target.value })} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Rent:</label>
          <input 
            type="number" 
            value={listing.property.rent} 
            onChange={(e) => setListing({ ...listing, property: { ...listing.property, rent: e.target.value } })} 
            required 
          />
        </div>
        {/* Add more fields as needed */}
        <button type="submit" className="submit-button">Save Changes</button>
      </form>
    </div>
    </div>
  );
};

export default EditListing;
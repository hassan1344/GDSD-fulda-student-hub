import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockLandlordData } from '../../mockData'; // Import mock data for initial state
import './CreateNewListing.css'; // Import the CSS file
import NavBar from '../../components/NavBar'; // Adjusted path to Navbar component

const CreateNewListing = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rent, setRent] = useState('');
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Create a new listing object
    const newListing = {
      listing_id: mockLandlordData.listings.length + 1, // Simple ID generation
      title,
      description,
      images: [], // Placeholder for images
      status: "available", // Default status
      property: {
        address: "", // You can add more fields here if needed
        rent: parseFloat(rent),
        amenities: [] // Placeholder for amenities
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Update the mock data (you might want to manage this differently in a real app)
    mockLandlordData.listings.push(newListing);

    // Reset form fields after submission
    setTitle('');
    setDescription('');
    setRent('');

    console.log("New Listing Created:", newListing);

    // Navigate back to My Listings or show a success message
    navigate('/landlord/my-listings');
  };

  return (
    <div>
      <NavBar /> {}
    <div className="create-listing-container">
      <h1 className="create-title">Create New Listing</h1>
      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-group">
          <label>Title:</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Rent:</label>
          <input 
            type="number" 
            value={rent} 
            onChange={(e) => setRent(e.target.value)} 
            required 
          />
        </div>
        {/* Add more fields as needed */}
        <button type="submit" className="submit-button">Create Listing</button>
      </form>
    </div>
    </div>
  );
};

export default CreateNewListing;
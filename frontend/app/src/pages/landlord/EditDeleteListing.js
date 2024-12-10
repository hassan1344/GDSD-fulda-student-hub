import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockLandlordData } from '../../mockData'; // Import mock data
import NavBar from '../../components/NavBar'; // Adjusted path to Navbar component

const amenitiesList = [
  { name: 'Washing Machine', value: 'washing_machine' },
  { name: 'AC', value: 'ac' },
  { name: 'Heater', value: 'heater' },
  { name: 'Parking', value: 'parking' },
  { name: 'Toilet', value: 'toilet' }
];

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the listing to edit
  const listingToEdit = mockLandlordData.listings.find(listing => listing.listing_id === parseInt(id));
  
  const [listing, setListing] = useState(listingToEdit);
  const [selectedAmenities, setSelectedAmenities] = useState(listingToEdit.property.amenities || []);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Update the existing listing in mock data
    const index = mockLandlordData.listings.findIndex(list => list.listing_id === listing.listing_id);
    
    if (index !== -1) {
      mockLandlordData.listings[index] = {
        ...listing,
        property: {
          ...listing.property,
          amenities: selectedAmenities // Update amenities
        },
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

  const handleAmenityChange = (event) => {
    const value = event.target.value;
    if (selectedAmenities.includes(value)) {
      setSelectedAmenities(selectedAmenities.filter((amenity) => amenity !== value));
    } else {
      setSelectedAmenities([...selectedAmenities, value]);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-green-700 mb-6">Edit Listing</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 max-w-lg mx-auto border border-green-200">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Title:</label>
            <input 
              type="text" 
              value={listing.title} 
              onChange={(e) => setListing({ ...listing, title: e.target.value })} 
              required 
              className="border border-gray-300 rounded-lg w-full p-4 focus:outline-none focus:ring focus:ring-green-300 transition duration-200"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Description:</label>
            <textarea 
              value={listing.description} 
              onChange={(e) => setListing({ ...listing, description: e.target.value })} 
              required 
              className="border border-gray-300 rounded-lg w-full p-4 focus:outline-none focus:ring focus:ring-green-300 h-32 resize-none transition duration-200"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Rent:</label>
            <input 
              type="number" 
              value={listing.property.rent} 
              onChange={(e) => setListing({ ...listing, property: { ...listing.property, rent: e.target.value } })} 
              required 
              className="border border-gray-300 rounded-lg w-full p-4 focus:outline-none focus:ring focus:ring-green-300 transition duration-200"
            />
          </div>

          {/* Amenities Checkboxes Section */}
          <fieldset className="mb-6">
            <legend className="block text-gray-700 text-sm font-semibold mb-2">Amenities:</legend>
            <div className="grid grid-cols-3 gap-x-4 gap-y-2">
              {amenitiesList.map((amenity) => (
                <label key={amenity.value} className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    value={amenity.value} 
                    checked={selectedAmenities.includes(amenity.value)}
                    onChange={handleAmenityChange}
                    className="form-checkbox h-5 w-5 text-green-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">{amenity.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration=200 shadow-md hover:shadow-lg">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditListing;
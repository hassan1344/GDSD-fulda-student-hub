import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockLandlordData } from '../../mockData'; // Import mock data for initial state
import NavBar from '../../components/NavBar'; // Adjusted path to Navbar component

const amenitiesList = [
  { name: 'Washing Machine', value: 'washing_machine' },
  { name: 'AC', value: 'ac' },
  { name: 'Heater', value: 'heater' },
  { name: 'Parking', value: 'parking' },
  { name: 'Toilet', value: 'toilet' }
];

const CreateNewListing = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rent, setRent] = useState('');
  const [images, setImages] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Create a new listing object
    const newListing = {
      listing_id: mockLandlordData.listings.length + 1,
      title,
      description,
      images,
      status: "available",
      property: {
        address: "",
        rent: parseFloat(rent),
        amenities: selectedAmenities
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockLandlordData.listings.push(newListing);
    setTitle('');
    setDescription('');
    setRent('');
    setImages([]);
    setSelectedAmenities([]);
    setTermsAccepted(false);

    console.log("New Listing Created:", newListing);
    navigate('/landlord/my-listings');
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);
  };

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
        <h1 className="text-4xl font-bold text-center text-black-700 mb-6">Create New Listing</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 max-w-lg mx-auto border border-green-200">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Title:</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              className="border border-gray-300 rounded-lg w-full p-4 focus:outline-none focus:ring focus:ring-green-300 transition duration-200"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Description:</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              className="border border-gray-300 rounded-lg w-full p-4 focus:outline-none focus:ring focus:ring-green-300 h-32 resize-none transition duration-200"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Rent:</label>
            <input 
              type="number" 
              value={rent} 
              onChange={(e) => setRent(e.target.value)} 
              required 
              className="border border-gray-300 rounded-lg w-full p-4 focus:outline-none focus:ring focus:ring-green-300 transition duration-200"
            />
          </div>

          {/* Upload Photos Section */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Upload Photos:</label>
            <input 
              type="file" 
              multiple 
              onChange={handleFileChange}
              accept="image/*"
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
                    onChange={handleAmenityChange}
                    className="form-checkbox h-5 w-5 text-green-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">{amenity.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Terms & Conditions Checkbox */}
          <div className="mb-6 flex items-center">
            <input 
              type="checkbox" 
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
              required
              className="form-checkbox h-5 w-5 text-green-600 border-gray-300 rounded"
            />
            <span className="ml-2 text-gray-700 text-sm">I accept the Terms & Conditions</span>
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration=200 shadow-md hover:shadow-lg">
            Create Listing
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNewListing;
/* Create New Property Page */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LandlordNavbar from '../../components/LandlordNavbar';
import { createProperty } from '../../services/LandlordServices';

/* State management for form inputs and UI feedback  */
const CreateNewProperties = () => {
    const [address, setAddress] = useState('');
    const [amenities, setAmenities] = useState([]);
    const [media, setMedia] = useState([]);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [newAmenity, setNewAmenity] = useState({ name: '', value: '' });
    const navigate = useNavigate();

/* Add new amenity to the amenities list */    
const handleAddAmenity = () => {
if (newAmenity.name && newAmenity.value) {
  setAmenities([...amenities, {
  amenity_name: newAmenity.name,
  amenity_value: newAmenity.value
  }]);
  setNewAmenity({ name: '', value: '' });
  }};

/* Remove amenity by index */  
  const handleRemoveAmenity = (index) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };
/*  Handle file input for property images */
  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMedia(files);
  };
/*----------------------------------*/  
/* Handle form submission */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError('Please accept the Terms and Conditions');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccess(false);
  
try {
    const formData = new FormData();
    formData.append('address', address);
    formData.append('amenities', JSON.stringify(amenities));

    if (media && media.length > 0) {
    for (let i = 0; i < media.length; i++) {
      formData.append('media[]', media[i]);
    }}

    const token = localStorage.getItem('accessToken');
    const response = await fetch('https://fulda-student-hub.publicvm.com/api/v1/propertiesModule', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
  
    const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => { navigate('/landlord/my-listings');}, 2000);
      } else {
        throw new Error(data.error || 'Failed to create property');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to create property');
    } finally {
      setIsLoading(false);
    }
  };
  
  
  
  return (
    <div className="min-h-screen bg-green-50">
      <LandlordNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-green-700 mb-6">Create New Property</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
          {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
          {success && <div className="text-green-500 mb-4 font-bold text-center">Property created successfully! Redirecting...</div>}

 {/* Property Address Input */}         
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Property Address *</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
              placeholder="Enter property address"
            />
          </div>

{/* Amenities Input Section */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Add Amenities</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Amenity name (e.g., Parking)"
                value={newAmenity.name}
                onChange={(e) => setNewAmenity({...newAmenity, name: e.target.value})}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Value (e.g., Private)"
                value={newAmenity.value}
                onChange={(e) => setNewAmenity({...newAmenity, value: e.target.value})}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
              Add
              </button>
            </div>
            <div className="space-y-2">
              {amenities.map((amenity, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>{amenity.amenity_name}: {amenity.amenity_value}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                  Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

{/* Media Upload Section */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Property Images</label>
            <input
              type="file"
              onChange={handleMediaChange}
              multiple
              accept="image/*"
              className="w-full p-2 border rounded-lg"
            />
            {media.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                {media.length} file(s) selected
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="form-checkbox h-5 w-5 text-green-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">I accept the Terms and Conditions</span>
            </label>
          </div>

{/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition duration-200 disabled:bg-gray-400"
          >
            {isLoading ? 'Creating Property...' : 'Create Property'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNewProperties;

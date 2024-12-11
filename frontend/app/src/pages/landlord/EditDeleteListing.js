import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LandlordNavbar from '../../components/LandlordNavbar';
import { fetchPropertyById, updateProperty, deleteProperty } from '../../services/LandlordServices';

const amenitiesList = [
  { name: 'Washing Machine', value: 'washing_machine' },
  { name: 'AC', value: 'ac' },
  { name: 'Heater', value: 'heater' },
  { name: 'Parking', value: 'parking' },
  { name: 'Toilet', value: 'toilet' }
];

const EditDeleteListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  useEffect(() => {
    const fetchListing = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const data = await fetchPropertyById(id, token);
        if (data.success) {
          setListing(data.data);
          setSelectedAmenities(data.data.amenities);
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
      }
    };
    fetchListing();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('accessToken');
    const updatedListing = {
      rent: parseFloat(listing.rent),
      amenities: selectedAmenities
    };

    try {
      const data = await updateProperty(id, updatedListing, token);
      if (data.success) {
        navigate('/landlord/my-listings');
      }
    } catch (error) {
      console.error('Error updating listing:', error);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const data = await deleteProperty(id, token);
      if (data.success) {
        navigate('/landlord/my-listings');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const handleAmenityChange = (event) => {
    const value = event.target.value;
    setSelectedAmenities(prev => 
      prev.includes(value) ? prev.filter(a => a !== value) : [...prev, value]
    );
  };

  if (!listing) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-green-50">
      <LandlordNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-green-700 mb-6">Edit Listing</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 max-w-lg mx-auto border border-green-200">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Address:</label>
            <input 
              type="text" 
              value={listing.address} 
              readOnly 
              className="border border-gray-300 rounded-lg w-full p-4 bg-gray-100"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Rent:</label>
            <input 
              type="number" 
              value={listing.rent} 
              onChange={(e) => setListing({ ...listing, rent: e.target.value })} 
              required 
              className="border border-gray-300 rounded-lg w-full p-4 focus:outline-none focus:ring focus:ring-green-300 transition duration-200"
            />
          </div>
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
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg mb-4">
            Save Changes
          </button>
          <button type="button" onClick={handleDelete} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg">
            Delete Listing
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditDeleteListing;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LandlordNavbar from '../../components/LandlordNavbar';
import { createProperty } from '../../services/LandlordServices';

const amenitiesList = [
  { name: 'Washing Machine', value: 'washing_machine' },
  { name: 'AC', value: 'ac' },
  { name: 'Heater', value: 'heater' },
  { name: 'Parking', value: 'parking' },
  { name: 'Toilet', value: 'toilet' }
];

const CreateNewProperties = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [rent, setRent] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!acceptedTerms) {
      alert('Please accept the Terms and Conditions');
      return;
    }
    const token = localStorage.getItem('accessToken');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('address', address);
    formData.append('rent', rent);
    formData.append('amenities', JSON.stringify(selectedAmenities));
    images.forEach((image, index) => {
      formData.append(`image${index}`, image);
    });

    try {
      const data = await createProperty(formData, token);
      if (data.success) {
        navigate('/landlord/my-listings');
      } else {
        console.error('Error creating listing:', data.message);
      }
    } catch (error) {
      console.error('Error creating listing:', error);
    }
  };

  const handleAmenityChange = (event) => {
    const value = event.target.value;
    setSelectedAmenities(prev => 
      prev.includes(value) ? prev.filter(a => a !== value) : [...prev, value]
    );
  };

  const handleImageUpload = (event) => {
    setImages([...event.target.files]);
  };

  return (
    <div className="min-h-screen bg-green-50">
      <LandlordNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-black-700 mb-6">Create New Property</h1>
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
              className="border border-gray-300 rounded-lg w-full p-4 focus:outline-none focus:ring focus:ring-green-300 transition duration-200"
              rows="4"
            ></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Address:</label>
            <input 
              type="text" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              required 
              className="border border-gray-300 rounded-lg w-full p-4 focus:outline-none focus:ring focus:ring-green-300 transition duration-200"
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
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Upload Images:</label>
            <input 
              type="file" 
              onChange={handleImageUpload} 
              multiple 
              accept="image/*"
              className="border border-gray-300 rounded-lg w-full p-4 focus:outline-none focus:ring focus:ring-green-300 transition duration-200"
            />
          </div>
          <div className="mb-6">
            <label className="inline-flex items-center">
              <input 
                type="checkbox" 
                checked={acceptedTerms} 
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="form-checkbox h-5 w-5 text-green-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">I accept the Terms and Conditions</span>
            </label>
          </div>
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg">
            Create Property
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNewProperties;

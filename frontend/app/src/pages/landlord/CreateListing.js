/* Create a New listing  "My Listing" > "Create New Listing" */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandlordNavbar from '../../components/LandlordNavbar';
import { createListing } from '../../services/ListingServices';

  const CreateListing = () => {
  const navigate = useNavigate();

/*state to manage form inputs */
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Available',
    rent: '',
    room_type_id: '',
    property_id: ''
  });
// State variables  
  const [files, setFiles] = useState([]);
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

// Room type : static   
  const roomTypes = [
    { id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s', name: 'Loft' },
    { id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', name: 'Studio Apartment'},
    { id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q', name: '1-Bedroom Apartment'},
    { id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r', name: '2-Bedroom Apartment' },
    { id: '6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u', name: 'Maisonette' },
    { id: '5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t', name: 'Penthouse'}
  ];

// Fetch available properties from the backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('https://fulda-student-hub.publicvm.com/api/v1/propertiesModule/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (data.success) {
          setProperties(data.data);
        }
      } catch (error) {
        setError('Error fetching properties');
      }
    };
    fetchProperties();
  }, []);

// Handle changes in form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
 // Handle file input changes
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };
// Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!formData.property_id) {
      setError('Please select a property');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const submitData = new FormData();
// Append form data to FormData object
      Object.keys(formData).forEach(key => {
        if (formData[key]) submitData.append(key, formData[key]);
      });
// Append selected images
      files.forEach(file => {
        submitData.append('media[]', file);
      });

      const response = await createListing(submitData, token);
      if (response.success) {
        navigate('/landlord/my-prop-listings');
      } else {
        setError(response.message || 'Failed to create listing');
      }
    } catch (error) {
      setError('Error creating listing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <LandlordNavbar />
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/landlord/my-prop-listings')}
          className="mb-6 flex items-center text-green-700 hover:text-green-800 font-semibold"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          Back to Listings
        </button>

        <h1 className="text-4xl font-bold text-center text-green-700 mb-8">
          Create New Listing
        </h1>

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Property</label>
              <select
                name="property_id"
                value={formData.property_id}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select Property</option>
                {properties.map(property => (
                  <option key={property.property_id} value={property.property_id}>
                    {property.address}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Rent (€)</label>
              <input
                type="number"
                name="rent"
                value={formData.rent}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Room Type</label>
              <select
                name="room_type_id"
                value={formData.room_type_id}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select Room Type</option>
                {roomTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-center">{error}</div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/landlord/my-prop-listings')}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 disabled:bg-green-400"
              >
                {isLoading ? 'Creating...' : 'Create Listing'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;

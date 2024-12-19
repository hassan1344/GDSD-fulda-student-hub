import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LandlordNavbar from '../../components/LandlordNavbar';
import { fetchListingById, updateListing } from '../../services/ListingServices';

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    rent: '',
    room_type_id: '',
    property_id: ''
  });
  const [files, setFiles] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleMedia, setVisibleMedia] = useState([]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetchListingById(id, token);
        if (response.success) {
          setListing(response.data);
          setVisibleMedia(response.data.media || []);
          setFormData({
            title: response.data.title,
            description: response.data.description,
            status: response.data.status,
            rent: response.data.rent,
            room_type_id: response.data.room_type_id,
            property_id: response.data.property_id
          });
        }
      } catch (error) {
        setError('Failed to fetch listing details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleImageDelete = async (mediaId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const updateFormData = new FormData();

      // Append necessary fields to FormData
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== undefined && formData[key] !== null) {
          updateFormData.append(key, formData[key]);
        }
      });

      // Append the image to delete
      updateFormData.append('imagesToDelete[]', mediaId);

      // Make an API call to update the listing
      const response = await updateListing(id, updateFormData, token);

      if (response.success) {
        // Update frontend UI to reflect the deletion
        setVisibleMedia((prev) => prev.filter((media) => media.media_id !== mediaId));
      } else {
        throw new Error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Failed to delete image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const updateFormData = new FormData();

      // Append all form data
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== undefined && formData[key] !== null) {
          updateFormData.append(key, formData[key]);
        }
      });

      // Append new files
      files.forEach((file) => {
        updateFormData.append('media[]', file);
      });

      // Append images to delete as JSON string
      if (imagesToDelete.length > 0) {
        updateFormData.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }

      // Add property_id explicitly
      if (listing && listing.property_id) {
        updateFormData.append('property_id', listing.property_id);
      }

      const response = await updateListing(id, updateFormData, token);

      if (response.success) {
        navigate('/landlord/my-prop-listings');
      } else {
        console.error('Update failed:', response);
        setError(response.message || 'Failed to update listing');
      }
    } catch (error) {
      console.error('Update error:', error);
      setError('Failed to update listing: ' + error.message);
    }
  };

  if (isLoading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center text-red-600 p-8">{error}</div>;
  if (!listing) return <div className="text-center p-8">Listing not found</div>;

  return (
    <div className="min-h-screen bg-green-50">
      <LandlordNavbar />
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/landlord/my-prop-listings')}
          className="mb-6 flex items-center text-green-700 hover:text-green-800 font-semibold transition duration-200"
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

        <h1 className="text-4xl font-bold text-center text-green-700 mb-8">Edit Listing</h1>

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
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
              <label className="block text-lg font-medium text-gray-700 mb-2">Rent</label>
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
              <label className="block text-lg font-medium text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="Available">Available</option>
                <option value="Rented">Rented</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Current Images</label>
              <div className="grid grid-cols-3 gap-4">
                {visibleMedia.map((media) => (
                  <div key={media.media_id} className="relative">
                    <img
                      src={`https://fulda-student-hub.s3.eu-north-1.amazonaws.com/public/uploads/images/${media.media_url}`}
                      alt="Listing"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageDelete(media.media_id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Add New Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
            </div>

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
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
              >
                Update Listing
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListing;

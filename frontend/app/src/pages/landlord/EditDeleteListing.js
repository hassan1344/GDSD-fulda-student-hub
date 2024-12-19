import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LandlordNavbar from '../../components/LandlordNavbar';
import { fetchPropertyById, updateProperty } from '../../services/LandlordServices';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [address, setAddress] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [newMedia, setNewMedia] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newAmenity, setNewAmenity] = useState({ name: '', value: '' });
  const [displayedImages, setDisplayedImages] = useState([]);

  useEffect(() => {
    const fetchProperty = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const data = await fetchPropertyById(id, token);
        if (data.success) {
          console.log("dev", data)
          setProperty(data.data);
          setAddress(data.data.address);
          setAmenities(data.data.PropertyAmenity.map(pa => ({
            amenity_name: pa.Amenity.amenity_name,
            amenity_value: pa.Amenity.amenity_value
          })));
          setDisplayedImages(data.data.media || []);
        }
      } catch (error) {
        setError('Error fetching property details');
      }
    };
    fetchProperty();
  }, [id]);

  const handleAddAmenity = () => {
    if (newAmenity.name && newAmenity.value) {
      setAmenities([...amenities, {
        amenity_name: newAmenity.name,
        amenity_value: newAmenity.value
      }]);
      setNewAmenity({ name: '', value: '' });
    }
  };

  const handleRemoveAmenity = (index) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  const handleMediaChange = (e) => {
    setNewMedia(Array.from(e.target.files));
  };

  const handleImageDelete = async (mediaId) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      
      // Create FormData with all required fields
      const formData = new FormData();
      formData.append('address', address);
      formData.append('amenities', JSON.stringify(amenities));
      formData.append('imagesToDelete[]', mediaId); // Changed from JSON string to direct value
  
      const response = await fetch(`http://localhost:8000/api/v1/propertiesModule/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
  
      const data = await response.json();
      
      if (data.success) {
        // Update the UI only after successful deletion
        setDisplayedImages(prev => prev.filter(img => img.media_id !== mediaId));
        // Update the property state to maintain consistency
        setProperty(prev => ({
          ...prev,
          media: prev.media.filter(img => img.media_id !== mediaId)
        }));
      } else {
        throw new Error(data.error || 'Failed to delete image');
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('address', address);
      formData.append('amenities', JSON.stringify(amenities));
      
      if (imagesToDelete.length > 0) {
        formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }

      if (newMedia.length > 0) {
        newMedia.forEach((file) => {
          formData.append('media[]', file);
        });
      }

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8000/api/v1/propertiesModule/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        navigate('/landlord/my-listings');
      } else {
        setError(data.error || 'Failed to update property');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update property');
    } finally {
      setIsLoading(false);
    }
  };

  if (!property) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-green-50">
      <LandlordNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-green-700 mb-6">Edit Property</h1>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Amenities</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Amenity name"
                value={newAmenity.name}
                onChange={(e) => setNewAmenity({...newAmenity, name: e.target.value})}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Value"
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

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Current Images</label>
            <div className="grid grid-cols-2 gap-4">
              {displayedImages.map((media) => (
                <div key={media.media_id} className="relative">
                  <img
                    src={`https://fulda-student-hub.s3.eu-north-1.amazonaws.com/public/uploads/images/${media.media_url}`}
                    alt="Property"
                    className="w-full h-40 object-cover rounded"
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

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Add New Images</label>
            <input
              type="file"
              onChange={handleMediaChange}
              multiple
              accept="image/*"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition duration-200"
          >
            {isLoading ? 'Updating...' : 'Update Property'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;

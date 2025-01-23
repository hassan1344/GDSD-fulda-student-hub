/* Edit Property Page "View Property" > "Edit Property" OR "Delete Property" */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LandlordNavbar from '../../components/LandlordNavbar';
import { fetchPropertyById, fetchPropertyByIdAdmin, updateProperty } from '../../services/LandlordServices';
import { jwtDecode } from 'jwt-decode';
import { updatePropertyAdmin } from '../../services/propertyServices';

const token = localStorage.getItem('accessToken');
const decodedToken = jwtDecode(token);
const { userType } = decodedToken;

const EditProperty = () => {
/* Extract property ID from URL parameters using useParams hook  */
  const { id } = useParams();
  const navigate = useNavigate();

/* Local state variables to hold property data, loading state, and error messages */
  const [property, setProperty] = useState(null);
  const [address, setAddress] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [newMedia, setNewMedia] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newAmenity, setNewAmenity] = useState({ name: '', value: '' });
  const [displayedImages, setDisplayedImages] = useState([]);


 /* Fetch property details when the component mounts or when 'id' changes */
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = userType === "ADMIN" ? await fetchPropertyByIdAdmin(id, token) : await fetchPropertyById(id, token);
        if ((userType === "ADMIN" && data) || data.success) {
          setProperty(data || data.data);
          setAddress(data.address || data.data.address);

          // if (data.data.PropertyAmenity != null) {
          //   let propAmenity = data.data.PropertyAmenity;
          //   setAmenities(propAmenity.map(pa => ({
          //     amenity_name: pa.Amenity.amenity_name,
          //     amenity_value: pa.Amenity.amenity_value
          //   })));
          // }
          
          setDisplayedImages(data.Media || data.data.media);
        }
      } catch (error) {
        console.log("error", error)
        setError('Error fetching property details');
      }};
    fetchProperty();
  }, [id]);   // Dependency on 'id' ensures it fetches data whenever the ID changes

/* Add a new amenity to the amenities list */
  const handleAddAmenity = () => {
    if (newAmenity.name && newAmenity.value) {
      setAmenities([...amenities, {
        amenity_name: newAmenity.name,
        amenity_value: newAmenity.value
      }]);
      setNewAmenity({ name: '', value: '' });
    }};
/* Remove an amenity from the amenities list */
  const handleRemoveAmenity = (index) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  const handleMediaChange = (e) => {
  setNewMedia(Array.from(e.target.files));
  };
   
  const handleImageDelete = (mediaId) => {
  setImagesToDelete([...imagesToDelete, mediaId]);
  setDisplayedImages((prev) => prev.filter((img) => img.media_id !== mediaId));
  };
  
  /* Handle form submission to update property details */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
/* Prepare FormData with the updated property details */      
      const formData = new FormData();
      formData.append('address', address);
      formData.append('amenities', JSON.stringify(amenities));
// delete image, if any      
      if (imagesToDelete.length > 0) {
        formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }
// images append, if any
      if (newMedia.length > 0) {
        newMedia.forEach((file) => {
          formData.append('media[]', file);
        });
      }


    const response = userType === "ADMIN" ? await updatePropertyAdmin(id, formData) : await updateProperty(id, formData);

      if (response.success) {
        navigate(userType === "ADMIN" ? '/admin/properties' : '/landlord/my-listings');
      } else {
        setError(response.message || 'Failed to update property');
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

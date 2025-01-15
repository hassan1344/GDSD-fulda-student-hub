/* Deleting a property */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LandlordNavbar from '../../components/LandlordNavbar';

const DeleteProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8000/v1/propertiesModule/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        navigate('/landlord/my-listings');
      } else {
        setError(data.error || 'Failed to delete property');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete property');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/landlord/my-listings');
  };

  return (
    <div className="min-h-screen bg-green-50">
      <LandlordNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Confirm Property Deletion
          </h1>
          
          {error && (
            <div className="mb-4 text-red-500 text-center">
              {error}
            </div>
          )}

          <p className="text-gray-600 mb-6 text-center">
            Are you sure you want to delete this property? This action cannot be undone.
          </p>

          <div className="flex gap-4">
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded transition duration-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete Property'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProperty;

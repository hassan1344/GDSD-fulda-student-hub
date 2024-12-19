import axios from 'axios';
const BASE_URL = 'http://localhost:8000/api/v1';
//const BASE_URL = 'https://localhost:8000/api/v1/propertiesModule';

//const BASE_URL = 'https://16.171.165.15/api/v1';

export const getProfileByUsername = async (userName) => {
  try {
    const response = await axios.get(`/api/v1/profile/${userName}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile by username:', error);
    throw error;
  }
};

export const fetchAllProperties = async (token) => {
  const response = await fetch(`${BASE_URL}/propertiesModule/`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data;
};



export const fetchPropertyById = async (propertyId, token) => {
  const response = await fetch(`${BASE_URL}/propertiesModule/${propertyId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};


export const createProperty = async (formData, token) => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/propertiesModule', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create property');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};





export const updateProperty = async (propertyId, propertyData, token) => {
  const response = await fetch(`${BASE_URL}/${propertyId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(propertyData)
  });
  return response.json();
};

export const deleteProperty = async (propertyId, token) => {
  const response = await fetch(`${BASE_URL}/${propertyId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

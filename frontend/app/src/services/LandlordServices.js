const BASE_URL = 'http://localhost:8000/api/v1';
export const fetchAllProperties = async (token) => {
  const response = await fetch(`${BASE_URL}/propertiesModule`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const fetchPropertyById = async (propertyId, token) => {
  const response = await fetch(`${BASE_URL}/${propertyId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const createProperty = async (propertyData, token) => {
  const response = await fetch(`${BASE_URL}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(propertyData)
  });
  return response.json();
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

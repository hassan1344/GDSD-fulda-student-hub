const BASE_URL = 'http://localhost:8000/api/v1/listingsModule';


export const fetchLandlordDetails = async (userName) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`http://localhost:8000/api/v1/landlordModule/profile`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch landlord details');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in fetchLandlordDetails:', error);
    throw error;
  }
};


export const fetchAllListings = async (token) => {
  const response = await fetch(`${BASE_URL}/`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};


export const fetchListingById = async (listingId, token) => {
  const response = await fetch(`${BASE_URL}/${listingId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const createListing = async (formData, token) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create listing');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

export const updateListing = async (listingId, listingData, token) => {
  try {
    const response = await fetch(`${BASE_URL}/${listingId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type for FormData
      },
      body: listingData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Update response:', result);
    return result;
  } catch (error) {
    console.error('Error in updateListing:', error);
    throw error;
  }
};

export const deleteListing = async (listingId, token) => {
  const response = await fetch(`${BASE_URL}/${listingId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

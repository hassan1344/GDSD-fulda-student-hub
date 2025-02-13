import apiClient from "./apiClient";

export const fetchProperties = async (location, priceRange, advancedFilters) => {
  const params = {
    address: location,
    minRent: priceRange[0],
    maxRent: priceRange[1],
  };

  if (Object.keys(advancedFilters).some((key) => advancedFilters[key])) {
    params.amenities = Object.keys(advancedFilters)
      .filter((key) => advancedFilters[key])
      .join(",");
  }

  const response = await apiClient.get(`/properties`, { params });
  return Array.isArray(response.data) ? response.data : [];
};

export const fetchAllProperties = async () => {
  try {
    const response = await apiClient.get("/propertiesModule/", {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all properties:", error);
    throw error;
  }
};


export const updatePropertyAdmin = async (listingId, listingData) => {
  try {
    const response = await apiClient.put(`/propertiesModule/admin/${listingId}`, listingData, {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating listing:", error);
    throw error;
  }
};

export const deletePropertyAdmin = async (listingId) => {
  try {
    const response = await apiClient.delete(`/propertiesModule/admin/${listingId}`, {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting listing:", error);
    throw error;
  }
};

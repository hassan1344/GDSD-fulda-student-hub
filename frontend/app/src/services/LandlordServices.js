import apiClient from "./apiClient";

export const getProfileByUsername = async (userName) => {
  try {
    const response = await apiClient.get(`/profile/${userName}`, {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching profile by username:", error);
    throw error;
  }
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

export const fetchAllPropertiesAdmin = async () => {
  try {
    const response = await apiClient.get("/properties/all", {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all properties:", error);
    throw error;
  }
};

export const fetchPropertyById = async (propertyId) => {
  try {
    const response = await apiClient.get(`/propertiesModule/${propertyId}`, {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching property by ID:", error);
    throw error;
  }
};

export const fetchPropertyByIdAdmin = async (propertyId) => {
  try {
    const response = await apiClient.get(`/properties/${propertyId}`, {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching property by ID:", error);
    throw error;
  }
};

export const createProperty = async (formData) => {
  try {
    const response = await apiClient.post("/propertiesModule", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};

export const updateProperty = async (propertyId, propertyData) => {
  try {
    const response = await apiClient.put(`/propertiesModule/${propertyId}`, propertyData, {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating property:", error);
    throw error;
  }
};


export const deleteProperty = async (propertyId) => {
  try {
    const response = await apiClient.delete(`/propertiesModule/${propertyId}`, {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
};

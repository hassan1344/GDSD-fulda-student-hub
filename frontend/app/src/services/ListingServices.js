import apiClient from "./apiClient";

export const fetchLandlordDetails = async () => {
  try {
    const response = await apiClient.get("/landlordModule/profile", {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error in fetchLandlordDetails:", error);
    throw error;
  }
};

export const fetchAllListings = async () => {
  try {
    const response = await apiClient.get("/listingsModule/", {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all listings:", error);
    throw error;
  }
};

export const fetchAllListingsAdmin = async () => {
  try {
    const response = await apiClient.get("/listingsModule/all", {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all listings:", error);
    throw error;
  }
};

export const fetchListingById = async (listingId) => {
  try {
    const response = await apiClient.get(`/listingsModule/${listingId}`, {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching listing by ID:", error);
    throw error;
  }
};

export const fetchListingByIdAdmin = async (listingId) => {
  try {
    const response = await apiClient.get(`/listingsModule/admin/${listingId}`, {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching listing by ID:", error);
    throw error;
  }
};

export const createListing = async (formData) => {
  try {
    const response = await apiClient.post("/listingsModule", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating listing:", error);
    throw error;
  }
};

export const updateListing = async (listingId, listingData) => {
  try {
    const response = await apiClient.put(`/listingsModule/${listingId}`, listingData, {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating listing:", error);
    throw error;
  }
};

export const updateListingAdmin = async (listingId, listingData) => {
  try {
    const response = await apiClient.put(`/listingsModule/admin/${listingId}`, listingData, {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating listing:", error);
    throw error;
  }
};

export const deleteListing = async (listingId) => {
  try {
    const response = await apiClient.delete(`/listingsModule/${listingId}`, {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting listing:", error);
    throw error;
  }
};

export const deleteListingAdmin = async (listingId) => {
  try {
    const response = await apiClient.delete(`/listingsModule/admin/${listingId}`, {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting listing:", error);
    throw error;
  }
};

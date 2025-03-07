import apiClient from "./apiClient";

// Fetch all amenities
export const getAllAmenities = async () => {
  try {
    const response = await apiClient.get("/utils/amenities");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching amenities:", error);
    return [];
  }
};

// Fetch a single amenity by its ID
export const getAmenityById = async (id) => {
  try {
    const response = await apiClient.get(`/utils/amenities/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching amenity with ID ${id}:`, error);
    return null;
  }
};

// Fetch all room types
export const getAllRoomTypes = async () => {
  try {
    const response = await apiClient.get("/utils/roomtypes");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching room types:", error);
    return [];
  }
};

// Fetch a single room type by its ID
export const getRoomTypeById = async (id) => {
  try {
    const response = await apiClient.get(`/utils/roomtypes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching room type with ID ${id}:`, error);
    return null;
  }
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length <= maxLength 
    ? text 
    : text.slice(0, maxLength) + '...';
};

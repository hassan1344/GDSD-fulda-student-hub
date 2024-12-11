import apiClient from "./apiClient";

// Create Profile
export const createProfile = async (profileData) => {
  const response = await apiClient.post(`/profile`, profileData);
  return response.data;
};

// Get Profile by Username
export const getProfileByUsername = async (userName) => {
  const response = await apiClient.get(`/profile/${userName}`);
  return response.data;
};

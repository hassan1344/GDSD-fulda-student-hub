import apiClient from "./apiClient";

// Create Profile
export const createProfile = async (profileData, accessToken) => {
  const response = await apiClient.post(`/profile`, profileData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// Get Profile by Username
export const getProfileByUsername = async (userName) => {
  // console.log("Decoded userName before URL encoding:", userName);

  const encodedUserName = encodeURIComponent(userName); // Encode username to ensure special characters don't break the URL
  const url = `/profile/${encodedUserName}`;
  
  console.log("Resolved endpoint URL:", url);

  const response = await apiClient.get(url, {
    requireToken: true, 
  });

  console.log("API response:", response);

  return response.data;
};

import apiClient from "./apiClient";

// Register User
export const registerUser = async (userType, userData) => {
  const response = await apiClient.post(`/auth/register`, userData, {
    params: { user: userType },
  });
  return response.data;
};

// Login User
export const loginUser = async (userData) => {
  const response = await apiClient.post(`/auth/login`, userData);
  return response.data;
};

// Logout User
export const logoutUser = async () => {
  const response = await apiClient.post(`/auth/logout`);
  return response.data; // Assuming response includes { message: "Logged out successfully" }
};

// Refresh Token
export const refreshToken = async (refreshToken) => {
  const response = await apiClient.post(`/auth/refresh-token`, { refreshToken });
  return response.data;
};

import apiClient from "./apiClient";

// Register User
export const registerUser = async (userData) => {
  const response = await apiClient.post(`/auth/register`, userData,);
  return response.data;
};

// Login User
export const loginUser = async (userData) => {
  const response = await apiClient.post(`/auth/login`, userData);
  return response.data;
};

// Logout User
export const logoutUser = async (userName) => {
  const response = await apiClient.post(`/auth/logout`, userName);
  return response.data; // Assuming response includes { message: "Logged out successfully" }
};

// Refresh Token
export const refreshToken = async ({ userName, refreshToken }) => {
  const response = await apiClient.post(`/auth/refresh-token`, {
    userName,
    refreshToken,
  });
  return response.data;
};


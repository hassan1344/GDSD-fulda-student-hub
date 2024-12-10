const BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://16.171.165.15/api/v1/";

// Register User
export const registerUser = async (userType, userData) => {
  const response = await fetch(`${BASE_URL}/auth/register?user=${userType}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
};

// Login User
export const loginUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const logoutUser = async () => {
  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json"},
  });

  if (!response.ok) {
    throw new Error("Failed to log out");
  }

  return response.json(); // Expecting { "message": "Logged out successfully" }
};

// Refresh Token
export const refreshToken = async (refreshToken) => {
  const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  return response.json();
};

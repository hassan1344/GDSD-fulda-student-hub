import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { logoutUser } from "./authServices";

const apiClient = axios.create({
  //  baseURL: "http://localhost:8000/v1",
 baseURL: "https://fulda-student-hub.publicvm.com/api/v1",
  timeout: 30000,
});

let isRefreshing = false; // Tracks ongoing refresh requests
let refreshSubscribers = []; // Queue for API calls waiting for a new token

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    if (config.requireToken) {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => response, // Pass successful responses
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and the request requires a token, handle refresh
    if (error.response?.status === 401 && originalRequest.requireToken) {
      if (!isRefreshing) {
        isRefreshing = true;

        const decodedToken = jwtDecode(localStorage.getItem("accessToken"));
        const { userName, userType } = decodedToken;

        try {
          // Attempt to refresh the token
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            throw new Error("No refresh token available.");
          }

          const response = await apiClient.post("/auth/refresh-token", {
            userName,
            refreshToken,
          });

          const { accessToken: newAccessToken } = response.data;

          // Save the new token
          localStorage.setItem("accessToken", newAccessToken);
          isRefreshing = false;

          // Retry queued requests with the new token
          refreshSubscribers.forEach((callback) => callback(newAccessToken));
          refreshSubscribers = [];
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          isRefreshing = false;

          // Handle token refresh failure (e.g., logout user)
          localStorage.clear();
          logoutUser(userName);
          window.location.href = "/app";
          // Redirect to login
          return Promise.reject(refreshError);
        }
      }

      // Return a promise that resolves when the refresh completes
      return new Promise((resolve) => {
        refreshSubscribers.push((newAccessToken) => {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(apiClient(originalRequest)); // Retry the original request
        });
      });
    }

    // If not a 401 error or token handling is not required, reject the error
    return Promise.reject(error);
  }
);

export default apiClient;

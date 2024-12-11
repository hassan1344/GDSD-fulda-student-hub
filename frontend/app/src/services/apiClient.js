// apiClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://fulda-student-hub.publicvm.com/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

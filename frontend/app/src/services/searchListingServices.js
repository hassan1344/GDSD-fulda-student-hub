import apiClient from "./apiClient";

export const fetchListings = async (filters) => {
    try {
      const response = await  apiClient.get("/searchListing", {
        params: filters,
      });;
      return response.data; // Return the data from the API
    } catch (error) {
      console.error("Error fetching featured listings:", error);
      return [];
    }
  };

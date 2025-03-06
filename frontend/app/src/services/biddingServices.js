import apiClient from "./apiClient";

export const getAllActiveBiddings = async () => {
  try {
    const response = await apiClient.get("/bidding/active-biddings");

    return response.data; // Return the data from the API
  } catch (error) {
    console.error("Error fetching active Biddings:", error);
    return [];
  }
};

export const getBiddingStatus = async (listingId) => {
    try {
      const response = await apiClient.get(`/bidding/status?listingId=${listingId}`, {
        requireToken: true,
      });
  
      return response.data; // Return the data from the API
    } catch (error) {
      console.error("Error fetching listing status", error);
      return [];
    }
  };

export const getListingsByIds = async (listingIds) => {
  if (!Array.isArray(listingIds) || listingIds.length === 0) {
    console.error("Invalid or empty listing IDs array");
    return [];
  }
  try {
    const response = await apiClient.post(
      "/searchListing/search",
      { ids: listingIds },
      {
        requireToken: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching listings by IDs:", error);
    return [];
  }
};

export const getUserBiddingSessions = async (userName) => {
  try {
    const response = await apiClient.get(`/bidding/user-biddings?userName=${userName}`, {
      requireToken: true,
    });

    return response.data; // Return the data from the API
  } catch (error) {
    console.error("Error fetching biddings", error);
    return [];
  }
};
export const getLandlordBiddingSessions = async (userName) => {
  try {
    const response = await apiClient.get(`/bidding/landlord-biddings?userName=${userName}`, {
      requireToken: true,
    });

    return response.data; // Return the data from the API
  } catch (error) {
    console.error("Error fetching biddings", error);
    return [];
  }
};
import apiClient from "./apiClient";

export const addReviewForLandlord = async (review) => {
  try {
    const response = await apiClient.post(`/reviews`, review, {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

export const getReviewsForALandlord = async (listingId) => {
  try {
    const response = await apiClient.get(`/reviews/${listingId}`, {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting reviews:", error);
    throw error;
  }
};

export const getStudentReviews = async (applicationId) => {
  try {
    const response = await apiClient.get(
      `/reviews/application/${applicationId}`,
      {
        requireToken: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting review:", error);
    throw error;
  }
};

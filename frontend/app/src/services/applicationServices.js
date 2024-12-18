import apiClient from "./apiClient";

export const submitApplication = async (formPayload, accessToken) => {
  try {
    const response = await apiClient.post(
      "/application/create-application",
      formPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting application:", error);
    throw error;
  }
};

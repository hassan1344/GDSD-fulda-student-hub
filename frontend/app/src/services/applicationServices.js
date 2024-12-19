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

export const getAllApplications = async () => {
  try {
    const response = await apiClient.get("/application/get-all-applications", {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting applications:", error);
    throw error;
  }
};

export const getApplicationByID = async (id) => {
  try {
    const response = await apiClient.get(`/application/get-application-by-id/${id}`, {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting applications:", error);
    throw error;
  }
};

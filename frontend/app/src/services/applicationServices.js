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

export const updateApplicationStatus = async (id, body) => {
  try {
    const response = await apiClient.put(
      `/application/update-application-by-id-l/${id}`,
      body,
      {
        requireToken: true
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

export const getApplicationByID = async (id, userType) => {
  try {
    let url = userType === "LANDLORD" ? `/application/get-application-by-id-l/${id}` : `/application/get-application-by-id/${id}`;
    const response = await apiClient.get(url, {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting applications:", error);
    throw error;
  }
};

export const getAllApplicationsByLandlord = async () => {
  try {
    const response = await apiClient.get("/application/get-all-applications-l", {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting applications:", error);
    throw error;
  }
};

export const getApprovedApplications = async () => {
  try {
    const response = await apiClient.get("/application/get-approved-applications", {
      requireToken: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting applications:", error);
    throw error;
  }
};


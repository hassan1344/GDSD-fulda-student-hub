import apiClient from "./apiClient";

export const submitApplication = async (formPayload) => {
  try {
    const response = await apiClient.post(
      "/application/create-application",
      formPayload,
      { headers: { "Content-Type": "multipart/form-data" }, requireToken: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

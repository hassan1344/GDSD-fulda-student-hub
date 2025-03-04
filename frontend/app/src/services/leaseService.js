import apiClient from '../../src/services/apiClient';

export const generateLease = async (leaseFormData, params) => {
  const response = await apiClient.post("/application/generate-lease", leaseFormData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    requireToken: true,
    responseType: 'blob'
  });

  if (response.statusText !== "OK") {
    throw new Error(`Failed to download PDF: ${response.statusText}`);
  }

  if (response.data) {
    const pdfBlob = new Blob([response.data], { type: "application/pdf" });
    return URL.createObjectURL(pdfBlob);
  } else {
    throw new Error("Empty PDF data received");
  }
};
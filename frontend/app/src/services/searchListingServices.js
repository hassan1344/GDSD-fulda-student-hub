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

  export const fetchScheduledMeetings = async (studentId) => {
    try {
      const response = await apiClient.get("/calendar/scheduledMeetings", {
        requireToken: true,
        params: { student_id: studentId }, // Pass student_id as a filter
      });
      return response.data; // Return the filtered data
    } catch (error) {
      console.error("Error fetching scheduled meetings:", error);
      return [];
    }
  };

export const fetchScheduledMeetingsForLandlord = async() =>{
  try {
    const response = await  apiClient.get("/calendar/scheduledMeetingsForlandlord", {
      requireToken: true,
      // params: filters,
    });;
    return response.data; // Return the data from the API
  } catch (error) {
    console.error("Error fetching featured listings:", error);
    return [];
  }
}
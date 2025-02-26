import apiClient from './apiClient'; // Your existing Axios instance
import { jwtDecode } from 'jwt-decode';


//---------------
export const getStudents = async () => {
  const accessToken = localStorage.getItem('accessToken');
  return apiClient.get('/calendar/students', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
};




export const scheduleMeeting = async (meetingData) => {
  const accessToken = localStorage.getItem('accessToken');
  const decodedToken = jwtDecode(accessToken);
  
  const payload = {
    ...meetingData,
    landlord_id: decodedToken.userId // Auto-populate from token
  };

  return apiClient.post('/calendar/schedule', payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};


export const getUserId  = async ()=> {
  const accessToken = localStorage.getItem('accessToken');
  return apiClient.get(`/calendar/userid/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};


export const getLandlordMeetings = async (landlordId) => {
  const accessToken = localStorage.getItem('accessToken');
  return apiClient.get(`/calendar/landlord/${landlordId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const cancelMeeting = async (meetingId) => {
  const accessToken = localStorage.getItem('accessToken');
  return apiClient.delete(`/calendar/cancel/${meetingId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

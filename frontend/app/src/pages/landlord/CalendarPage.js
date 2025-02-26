import React, { useEffect, useState } from 'react';
import { scheduleMeeting, getLandlordMeetings, cancelMeeting, getUserId } from '../../services/calendarService';
import { useAuth } from '../../pages/AuthContext';
import MeetingForm from './MeetingForm';
import MeetingList from './MeetingList';
import { format, parseISO } from 'date-fns';

const CalendarPage = () => {
const { user } = useAuth();
const [meetings, setMeetings] = useState([]);
const [error, setError] = useState('');
const [loading, setLoading] = useState(true);
const [students, setStudents] = useState([]);


useEffect(() => {
  const fetchMeetings = async () => {
  try {
  if (user?.userId && user?.userType === 'LANDLORD') 
  {
    const response = await getLandlordMeetings(user.userId);
    setMeetings(response.data.map(meeting => ({...meeting, date: format(parseISO(meeting.date), 'MMM dd, yyyy HH:mm')})));
   }} 
  catch (err) {
    setError('Failed to load meetings');
  } finally {
    setLoading(false);
  }};
  fetchMeetings();},[user]);


const handleScheduleMeeting = async (formData) => {
    try {
      const response = await scheduleMeeting(formData);
      setMeetings([...meetings, {
        ...response.data,
        date: format(parseISO(response.data.date), 'MMM dd, yyyy HH:mm')
      }]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to schedule meeting');
    }
  };








const handleCancelMeeting = async (meetingId) => {
    try {
      await cancelMeeting(meetingId);
      setMeetings(meetings.filter(meeting => meeting.meeting_id !== meetingId));
    } catch (err) {
      setError('Failed to cancel meeting');
    }
  };
  if (!user || user.userType !== 'LANDLORD') {
    return <div className="p-4 text-red-500">Landlord access required</div>;
  }

 
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Meeting Calendar</h1>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Schedule New Meeting</h2>
          <MeetingForm onSubmit ={handleScheduleMeeting}
          students = {students} />

        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Meetings</h2>
          {loading ? (
            <div className="animate-pulse">Loading meetings...</div>
          ) : (
            <MeetingList 
              meetings={meetings}
              onCancel={handleCancelMeeting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;

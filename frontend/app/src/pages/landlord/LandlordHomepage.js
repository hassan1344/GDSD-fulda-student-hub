/* Lanlord Homepage */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LandlordNavbar from '../../components/LandlordNavbar';
import { jwtDecode } from 'jwt-decode';
import { getProfileByUsername } from '../../services/profileServices';
import MeetingForm from './MeetingForm';
import { getAllApplicationsByLandlord, getApprovedApplications } from '../../services/applicationServices';
import { cancelMeeting, scheduleMeeting, updateMeetingStatus } from '../../services/calendarService';
import { fetchScheduledMeetings, fetchScheduledMeetingsForLandlord } from '../../services/searchListingServices';

const LandlordHomepage = () => {
  /* State to store the landlord's profile data, manage loading status, handle errors, store username extracted from token */
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUserName] = useState("");
  const [approvedApplication, setApprovedApplication] = useState([]);
  const [tableData, setTableData] = useState([]);

  /* Fetch profile data when the component mounts  */
  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        // Decode the access token to extract the username
        const decodedToken = jwtDecode(accessToken);
        const { userName } = decodedToken;
        setUserName(userName);

        if (userName) {
          // Fetch profile data
          const profileData = await getProfileByUsername(userName);
          console.log("Profile data:", profileData);
          setProfile(profileData);

          // Fetch approved applications after profile is fetched
          const applicationData = await getAllApplicationsByLandlord();
          console.log("Approved applications data:", applicationData.data);
          if (applicationData.success) {
            let filteredApplications = applicationData.data.filter(
              item => 
                item.application_status === 'APPROVED');
            setApprovedApplication(filteredApplications);
          } else {
            setError(applicationData.message || 'Failed to fetch applications');
          }

          // For Meeting Data
          const meetingData = await fetchScheduledMeetingsForLandlord();
          console.log(49, meetingData)
          setTableData(meetingData);
        } else {
          setError("Username is not valid.");
        }
      } catch (err) {
        setError("Error loading data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  async function onSchedule(formData) {
    try {

      const response = await scheduleMeeting(formData);
      alert('Meeting scheduled successfully!');
      // Refresh the page after successful Schedule
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to schedule meeting');
    }
  }

  const handleDelete = async (row) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        // Assuming there's an API endpoint to delete meetings
        // Replace with your actual API call
        const response = await cancelMeeting(row.meeting_id);

        if (!(response.status === 200)) {
          throw new Error('Failed to delete meeting');
        }

        // Update the local state by filtering out the deleted row
        setTableData(tableData.filter(item => item.meeting_id !== row.meeting_id));

        alert('Meeting deleted successfully!');

      } catch (error) {
        console.error('Error deleting meeting:', error);
        alert('Failed to delete meeting: ' + error.message);
      }
    }
  };

  /* Menu items for the landlord dashboard */
  const menuItems = [
    { title: 'Create New Properties', path: '/landlord/create-listing', icon: '📝' },
    { title: 'View Properties', path: '/landlord/my-listings', icon: '📊' },
    { title: 'My Listings', path: '/landlord/my-prop-listings', icon: '🏠' },
    { title: ' Select Requests', path: '/landlord/select-requests', icon: '✅' },
    { title: ' My Biddings', path: '/landlord/my-bids', icon: '🔔' },
    // { title: 'New Requests', path: '/landlord/requests', icon: '' },
    // { title: 'View Tenants', path: '/landlord/tenants', icon: '👁️' },
    // { title: 'Register for Bidding', path: '/register-bidding', icon: '🏷️' },
    // { title: 'View Past Tenants', path: '/past-tenants', icon: '👥' },
    // { title: 'Documents', path: '/documents', icon: '📁' },
    // { title: 'Raise an Issue', path: '/raise-issue', icon: '⚠️' },
  ];

  const updateStatus = async (row, newStatus) => {
    try {
      const response = await updateMeetingStatus(row.meeting_id, newStatus);

      if (response.status === 200) {
        setTableData(prevTableData =>
          prevTableData.map(item =>
            item.meeting_id === row.meeting_id ? { ...item, status: newStatus } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };


  return (
    <div className="background-container">
      <LandlordNavbar />
      <div className="container mx-auto px-4 py-8">

        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Welcome, {profile?.first_name} {profile?.last_name}</h1>
        <div className="bg-white shadow-2xl rounded-lg p-6 max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">What would you like to do today?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((item, index) => (
              <Link key={index} to={item.path}>
                <div className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg p-4 shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className='bg-white shadow-2xl rounded-lg p-6 max-w-6xl mx-auto mt-4'>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Schedule & Manage Meetings</h3>
          <MeetingForm onSubmit={onSchedule} students={approvedApplication} />

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Landlord Meetings</h3>
            <div className="panel-body text-gray-700">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 text-left">Student Name</th>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2">{row.student.first_name} {row.student.last_name}</td>
                      <td className="p-2">{new Date(row.date).toUTCString()}</td>
                      <td className={`p-2 font-semibold ${row.status === 'SCHEDULED' ? 'text-green-600' :
                        row.status === 'CANCELED' ? 'text-red-600' :
                          row.status === 'COMPLETED' ? 'text-blue-600' :
                            'text-gray-600'
                        }`}>
                        {row.status}
                      </td>
                      { row.status === 'SCHEDULED' && <td className="p-2 flex gap-2">
                        <button
                          className="text-red-500 hover:text-red-700 px-2 py-1 border rounded"
                          onClick={() => updateStatus(row, 'CANCELED')}
                          title="Mark as Canceled"
                        >
                          ❌ Cancel
                        </button>
                        <button
                          className="text-blue-500 hover:text-blue-700 px-2 py-1 border rounded"
                          onClick={() => updateStatus(row, 'COMPLETED')}
                          title="Mark as Completed"
                        >
                          ✅ Complete
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 px-2 py-1 border rounded"
                          onClick={() => handleDelete(row)}
                          title="Delete"
                        >
                          🗑️ Delete
                        </button>
                      </td> }
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandlordHomepage;
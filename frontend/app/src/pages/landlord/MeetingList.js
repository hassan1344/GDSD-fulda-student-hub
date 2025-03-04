import React from 'react';

const MeetingList = ({ meetings, onCancel }) => {
  if (meetings.length === 0) {
    return <div className="text-gray-500">No upcoming meetings</div>;
  }

  return (
    <div className="space-y-4">
      {meetings.map(meeting => (
        <div key={meeting.meeting_id} className="p-4 border rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">
                {meeting.student?.first_name} {meeting.student?.last_name}
              </h3>
              <p className="text-sm text-gray-600">{meeting.date}</p>
              <span className={`text-sm ${
                meeting.status === 'CANCELED' ? 'text-red-500' : 'text-green-500'
              }`}>
                {meeting.status}
              </span>
            </div>
            {meeting.status === 'SCHEDULED' && (
              <button
                onClick={() => onCancel(meeting.meeting_id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MeetingList;

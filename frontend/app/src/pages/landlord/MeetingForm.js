import React, { useState } from 'react';
import { useAuth } from '../../pages/AuthContext';

const MeetingForm = ({ onSubmit , students}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    student_id: '',
    date: '',
    time: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const meetingDate = `${formData.date}T${formData.time}:00Z`;
    
    if (!formData.student_id || !formData.date || !formData.time) {
      alert('Please fill all fields');
      return;
    }

    if (new Date(meetingDate) < new Date()) {
      alert('Cannot schedule meetings in the past');
      return;
    }

    onSubmit({
      student_id: formData.student_id,
      date: meetingDate
    });
    
    setFormData({ student_id: '', date: '', time: '' });
  };

  return (

      

      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Student</label>
        <select
  value={formData.student_id}
  onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
  className="w-full p-2 border rounded"
  required
>
  <option value="">Select a student</option>
  {students.map((student) => (
    <option key={student.student_id} value={student.student_id}>
      {student.first_name} {student.last_name}
    </option>
  ))}
</select>
      </div>




      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-2 border rounded"
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Time</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Schedule Meeting
      </button>
    </form>
  );
};

export default MeetingForm;

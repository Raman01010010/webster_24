import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert2 for alerts
const Class = () => {
  const [formData, setFormData] = useState({
    classModuleName: '',
    room: '',
    day: '',
    startTime: '',
    endTime: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async () => {
    if (!formData.classModuleName || !formData.startTime || !formData.endTime) {
      Swal.fire('Error', 'Please fill in all required fields.', 'error'); // Show error alert
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3500/api/class', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }  
      const data = await response.json();
      console.log(data); 
      // Show success alert
      Swal.fire('Success', 'Class added successfully!', 'success');

      // Clear form data after successful submission
      setFormData({
        classModuleName: '',
        room: '',
        day: '',
        startTime: '',
        endTime: '',
      });
    } catch (error) {
      console.error('Error:', error);
      // Show error alert
      Swal.fire('Error', 'Failed to add class. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setFormData({
      classModuleName: '',
      room: '',
      day: '',
      startTime: '',
      endTime: '',
    });
    setError(null);
    setSuccess(null);
  };
  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">New Class</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-gray-700">Class module name *</label>
            <input
              type="text"
              name="classModuleName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Name"
              value={formData.classModuleName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-gray-700">Room</label>
            <input
              type="text"
              name="room"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Room"
              value={formData.room}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 mb-4">
          <div>
            <label className="block text-gray-700">Day</label>
            <input
              type="text"
              name="day"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Day"
              value={formData.day}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-gray-700">Start Time *</label>
            <input
              type="time"
              name="startTime"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.startTime}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-gray-700">End Time *</label>
            <input
              type="time"
              name="endTime"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.endTime}
              onChange={handleChange}
            />
          </div>
        </div>
        {loading && <p className="text-blue-500">Submitting...</p>}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default Class;

import React from 'react';

const Class = () => {
  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">New Class</h2>
      <form>
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-gray-700">Class module name *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Name"
            />
          </div>
          <div>
            <label className="block text-gray-700">Subject *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option>Select</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-4">
          <div>
            <label className="block text-gray-700">Mode *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option>In Person</option>
              <option>Online</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Room</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Room"
            />
          </div>
          <div>
            <label className="block text-gray-700">Building</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Building"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-4">
          <div>
            <label className="block text-gray-700">Teacher</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Teacher"
            />
          </div>
          <div>
            <label className="block text-gray-700">Occurs *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option>Once</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Date *</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-gray-700">Start Time *</label>
            <input
              type="time"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700">End Time *</label>
            <input
              type="time"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Class;

import React from "react";

const Dashboard1 = () => {
  return (
    <div className="w-full md:w-4/5 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800">12:22 AM</h1>
          <p className="text-gray-500">Oct 31, 2024</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 md:p-6 rounded-lg shadow-md w-full md:w-auto">
          <h2 className="text-xl md:text-2xl font-semibold">Good Night.</h2>
          <p>You have 2 tasks due today.</p>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="mb-8">
        <h3 className="text-lg md:text-xl font-semibold mb-4">Today's Tasks</h3>
        <ul className="space-y-4">
          <li className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-lg shadow-md">
            <span className="font-semibold">Hello</span>
            <span className="text-gray-500">Science</span>
            <span className="text-gray-400">12:20 AM</span>
          </li>
          <li className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-lg shadow-md">
            <span className="font-semibold">Codeforces</span>
            <span className="text-gray-500">Mathematics</span>
            <span className="text-gray-400">04:16 AM</span>
          </li>
        </ul>
      </div>

      {/* Focus Timer */}
      <div className="bg-blue-100 p-4 md:p-6 rounded-lg shadow-md">
        <h3 className="text-lg md:text-xl font-semibold mb-4">Focus Timer</h3>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <span className="text-3xl md:text-4xl font-bold text-blue-700 mb-4 md:mb-0">24:56</span>
          <button className="bg-blue-500 text-white px-4 md:px-6 py-2 rounded-lg shadow-md hover:bg-blue-600">
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard1;

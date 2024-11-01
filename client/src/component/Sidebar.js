import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Container1 from "./Container1";
import Class from "./Class"; // Import the Class component

const Sidebar = () => {
  const location = useLocation();
  // State to manage sidebar visibility on small screens
  const [isOpen, setIsOpen] = useState(false);
  // State to manage the visibility of additional options
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  // State to manage the modal visibility for "Add Class"
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  // Toggle the sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  // Toggle the visibility of more options
  const toggleMoreOptions = () => {
    setShowMoreOptions(!showMoreOptions);
  };
  // Toggle the class modal
  const toggleClassModal = () => {
    setIsClassModalOpen(!isClassModalOpen);
  };
  return (
    <div className="flex h-screen">
      {/* Hamburger Button for Small Screens */}
      <button
        className="md:hidden p-4 text-black fixed top-4 left-4 z-50"
        onClick={toggleSidebar}
      >
        {/* Three-bar icon (hamburger) */}
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>
      {/* Sidebar */}
      <div
        className={`bg-white text-black w-64 p-5 shadow-md fixed top-0 left-0 h-full z-40 transform transition-transform duration-300 ease-in-out 
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:block overflow-y-auto`}
      >
        <div className="flex items-center mb-8">
          <div className="text-3xl font-bold">WEBSTER_2024</div>
        </div>
        <ul className="space-y-6">
          <li
            className={`p-2 rounded-md cursor-pointer ${
              location.pathname === "/dashboard1"
                ? "bg-blue-500 text-white"
                : "hover:bg-blue-100"
            }`}
          >
            <Link to="/dashboard1" onClick={() => setIsOpen(false)}>
              Dashboard
            </Link>
          </li>
          <li
            className={`p-2 rounded-md cursor-pointer ${
              location.pathname === "/calendar"
                ? "bg-blue-500 text-white"
                : "hover:bg-blue-100"
            }`}
          >
            <Link to="/calendar" onClick={() => setIsOpen(false)}>
              Calendar
            </Link>
          </li>
          <li
            className={`p-2 rounded-md cursor-pointer ${
              location.pathname === "/activities"
                ? "bg-blue-500 text-white"
                : "hover:bg-blue-100"
            }`}
          >
            <Link to="/activities" onClick={() => setIsOpen(false)}>
              Activities
            </Link>
          </li>
          <li
            className={`p-2 rounded-md cursor-pointer ${
              location.pathname === "/focus-timer"
                ? "bg-blue-500 text-white"
                : "hover:bg-blue-100"
            }`}
          >
            <Link to="/focus-timer" onClick={() => setIsOpen(false)}>
              Focus Timer
            </Link>
          </li>
        </ul>

        {/* Primary Button */}
        <div className="mt-8">
          <button
            onClick={toggleMoreOptions}
            className="w-full bg-blue-500 text-white py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            {showMoreOptions ? "Close" : "Add New"}
          </button>
        </div>
        {/* Conditional rendering of extra options */}
        {showMoreOptions && (
          <ul className="mt-4 space-y-4">
            <li className="p-2 rounded-md bg-blue-100 hover:bg-blue-200 cursor-pointer">
              <span onClick={toggleClassModal}>Add Class</span>
            </li>
            <li className="p-2 rounded-md bg-blue-100 hover:bg-blue-200 cursor-pointer">
              <Link to="/add-task" onClick={() => setIsOpen(false)}>
                Add Task
              </Link>
            </li>
            <li className="p-2 rounded-md bg-blue-100 hover:bg-blue-200 cursor-pointer">
              <Link to="/add-event" onClick={() => setIsOpen(false)}>
                Add Event
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6">
        <Container1 />
      </div>

      {/* Class Modal */}
      {isClassModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full relative">
      <Class />

      <div className="flex justify-between mt-6">
        <button
          onClick={toggleClassModal}
          className="px-4 py-2 bg-red-600 text-white rounded-md"
        >
          Close 
        </button>
        <Link to="/process">
      <button onClick={toggleClassModal} className="px-4 py-2 bg-red-600 text-white rounded-md">
        Extract TimeTable
      </button>
    </Link>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Sidebar;

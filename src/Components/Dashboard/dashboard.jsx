import React from "react";
import { FaUserCircle } from "react-icons/fa"; // Profile icon
import { IoMdNotificationsOutline } from "react-icons/io"; // Bell icon
import "./dashboard.css"; // Import the CSS file for styling

const Dashboard = () => {
  return (
    <div className="dashboard-home">
      {/* NavBar Section */}
      <nav className="navbar">
        <h1 className="navbar-logo">Microservices App</h1>
        <div className="navbar-icons">
          <IoMdNotificationsOutline className="notification-icon" />
          <FaUserCircle className="profile-icon" />
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <h1 className="dashboard-heading">Welcome to the Dashboard</h1>
      </div>
    </div>
  );
};

export default Dashboard;

import React from "react";
import "./DashboardNavbar.css";
import logo from "./logo.png"; // Logo in same folder

const DashboardNavbar = ({ toggleSidebar }) => {
 

  return (
    <div className="dashboard-navbar">
      <button className="navbar-toggle" onClick={toggleSidebar}>
        <span className="hamburger-icon">&#9776;</span>
      </button>
      <div className="navbar-logo-title">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <span className="navbar-title">Sri Jaya Rama Seva Mandali</span>
      </div>
    
    </div>
  );
};

export default DashboardNavbar;

import React from "react";
import { NavLink, useNavigate } from "react-router-dom"; // ✅ added useNavigate
import "./DashboardSidebar.css";

import {
  FaTachometerAlt,
  FaImage,
  FaCalendarAlt,
  FaPrayingHands,
  FaIdCard,
  FaInfoCircle,
  FaPhotoVideo,
  FaStream,
  FaYoutube,
  FaSignOutAlt,
  FaBook,
  FaKey
} from "react-icons/fa";

const DashboardSidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate(); 
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear(); 
    navigate("/login");
  };
  return (
    <div className={`dashboard-sidebar ${isOpen ? "open" : ""}`}>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-link" onClick={toggleSidebar}>
          <FaTachometerAlt className="sidebar-icon" /> Dashboard
        </NavLink>
        <NavLink to="/banner" className="sidebar-link" onClick={toggleSidebar}>
          <FaImage className="sidebar-icon" /> Banner
      </NavLink>

        <NavLink to="/add-events" className="sidebar-link" onClick={toggleSidebar}>
          <FaCalendarAlt className="sidebar-icon" /> Add Events
        </NavLink>

        <NavLink to="/add-sevas" className="sidebar-link" onClick={toggleSidebar}>
          <FaPrayingHands className="sidebar-icon" /> Add Sevas
        </NavLink>

        <NavLink to="/recurring-events" className="sidebar-link" onClick={toggleSidebar}>
          <FaCalendarAlt className="sidebar-icon" /> Recurring Events
        </NavLink>
        {/* <NavLink  to="/card-manager"  className="sidebar-link" onClick={toggleSidebar}>
        <FaIdCard className="sidebar-icon" /> Card Management
        </NavLink> */}
        <NavLink to="/aboutus" className="sidebar-link" onClick={toggleSidebar}>
          <FaInfoCircle className="sidebar-icon" /> About Us
        </NavLink>

        <NavLink to="/gallery" className="sidebar-link" onClick={toggleSidebar}>
          <FaPhotoVideo className="sidebar-icon" /> Gallery
        </NavLink>

        <NavLink to="/publications" className="sidebar-link" onClick={toggleSidebar}>
          <FaBook className="sidebar-icon" /> Publications
        </NavLink>

        <NavLink to="/scrolling" className="sidebar-link" onClick={toggleSidebar}>
          <FaStream className="sidebar-icon" /> Scrolling
        </NavLink>

        <NavLink to="/youtube" className="sidebar-link" onClick={toggleSidebar}>
          <FaYoutube className="sidebar-icon" /> YouTube
        </NavLink>

        <NavLink to="/change-password" className="sidebar-link" onClick={toggleSidebar}>
          <FaKey className="sidebar-icon" /> Change Password
        </NavLink>
        <a
          href="https://temple-accountant.vercel.app"
          className="sidebar-link"
          target="_blank"
          rel="noopener noreferrer"
          onClick={toggleSidebar}
        >
          <FaTachometerAlt className="sidebar-icon" /> Accountant
        </a>

        
        <NavLink
          to="/logout"
          className="sidebar-link"
          onClick={(e) => {
            e.preventDefault(); 
            toggleSidebar();
            handleLogout();
          }}
        >
          <FaSignOutAlt className="sidebar-icon" /> Logout
        </NavLink>
      </nav>
    </div>
  );
};

export default DashboardSidebar;

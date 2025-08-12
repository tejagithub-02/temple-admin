import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./DashboardSidebar.css";

import {
  FaTachometerAlt,
  FaImage,
  FaCalendarAlt,
  FaPrayingHands,
  FaInfoCircle,
  FaPhotoVideo,
  FaStream,
  FaYoutube,
  FaSignOutAlt,
  FaBook,
  FaKey // <-- add this here
} from "react-icons/fa";


const DashboardSidebar = ({ isOpen, toggleSidebar }) => {
  // Existing submenu states
  const [aboutSubmenuOpen, setAboutSubmenuOpen] = useState(false);
  const [publicationsSubmenuOpen, setPublicationsSubmenuOpen] = useState(false);
  const [sevasSubmenuOpen, setSevasSubmenuOpen] = useState(false);

  const toggleAboutSubmenu = (e) => {
    e.preventDefault();
    setAboutSubmenuOpen(!aboutSubmenuOpen);
  };

  const togglePublicationsSubmenu = (e) => {
    e.preventDefault();
    setPublicationsSubmenuOpen(!publicationsSubmenuOpen);
  };

  const toggleSevasSubmenu = (e) => {
    e.preventDefault();
    setSevasSubmenuOpen(!sevasSubmenuOpen);
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

        {/* New Recurring Events Link */}
        <NavLink to="/recurring-events" className="sidebar-link" onClick={toggleSidebar}>
          <FaCalendarAlt className="sidebar-icon" /> Recurring Events
        </NavLink>

        {/* Sevas Parent Link */}
        <a href="#sevasSubmenu" className="sidebar-link" onClick={toggleSevasSubmenu}>
          <FaPrayingHands className="sidebar-icon" /> Add Sevas
          <span className={`submenu-arrow ${sevasSubmenuOpen ? "open" : ""}`}>▸</span>
        </a>

        {/* Sevas Submenu */}
        {sevasSubmenuOpen && (
          <div className="submenu">
            <NavLink
              to="/add-sevas/general"
              className="sidebar-sublink"
              onClick={toggleSidebar}
            >
              General Sevas
            </NavLink>
            <NavLink
              to="/add-sevas/event-specific"
              className="sidebar-sublink"
              onClick={toggleSidebar}
            >
              Event-Specific Sevas
            </NavLink>
          </div>
        )}

        {/* About Us Parent Link */}
        <a href="#aboutSubmenu" className="sidebar-link about-link" onClick={toggleAboutSubmenu}>
          <FaInfoCircle className="sidebar-icon" /> About Us
          <span className={`submenu-arrow ${aboutSubmenuOpen ? "open" : ""}`}>▸</span>
        </a>

        {/* About Us Submenu */}
        {aboutSubmenuOpen && (
          <div className="submenu">
            <NavLink
              to="/about-us/our-mission"
              className="sidebar-sublink"
              onClick={toggleSidebar}
            >
              Our Mission
            </NavLink>
            <NavLink
              to="/about-us/our-activities"
              className="sidebar-sublink"
              onClick={toggleSidebar}
            >
              Our Activities
            </NavLink>
          </div>
        )}

        <NavLink to="/gallery" className="sidebar-link" onClick={toggleSidebar}>
          <FaPhotoVideo className="sidebar-icon" /> Gallery
        </NavLink>

        {/* Publications Parent Link */}
        <a
          href="#publicationsSubmenu"
          className="sidebar-link publications-link"
          onClick={togglePublicationsSubmenu}
        >
          <FaBook className="sidebar-icon" /> Publications
          <span className={`submenu-arrow ${publicationsSubmenuOpen ? "open" : ""}`}>▸</span>
        </a>

        {/* Publications Submenu */}
        {publicationsSubmenuOpen && (
          <div className="submenu">
            <NavLink
              to="/publications/books"
              className="sidebar-sublink"
              onClick={toggleSidebar}
            >
              Books
            </NavLink>
            <NavLink
              to="/publications/articles"
              className="sidebar-sublink"
              onClick={toggleSidebar}
            >
              Articles
            </NavLink>
          </div>
        )}

        <NavLink to="/scrolling" className="sidebar-link" onClick={toggleSidebar}>
          <FaStream className="sidebar-icon" /> Scrolling
        </NavLink>
        <NavLink to="/youtube" className="sidebar-link" onClick={toggleSidebar}>
          <FaYoutube className="sidebar-icon" /> YouTube
        </NavLink>
        <NavLink to="/change-password" className="sidebar-link" onClick={toggleSidebar}>
          <FaKey className="sidebar-icon" /> Change Password
        </NavLink>
        <NavLink to="/logout" className="sidebar-link" onClick={toggleSidebar}>
          <FaSignOutAlt className="sidebar-icon" /> Logout
        </NavLink>
      </nav>
    </div>
  );
};

export default DashboardSidebar;

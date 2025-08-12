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
  FaBook // Added icon for Publications (Books)
} from "react-icons/fa";

const DashboardSidebar = ({ isOpen, toggleSidebar }) => {
  // State to toggle About Us submenu open/close
  const [aboutSubmenuOpen, setAboutSubmenuOpen] = useState(false);
  // State to toggle Publications submenu open/close
  const [publicationsSubmenuOpen, setPublicationsSubmenuOpen] = useState(false);

  const toggleAboutSubmenu = (e) => {
    e.preventDefault(); // prevent navlink navigation on parent click
    setAboutSubmenuOpen(!aboutSubmenuOpen);
  };

  const togglePublicationsSubmenu = (e) => {
    e.preventDefault();
    setPublicationsSubmenuOpen(!publicationsSubmenuOpen);
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
        <NavLink to="/logout" className="sidebar-link" onClick={toggleSidebar}>
          <FaSignOutAlt className="sidebar-icon" /> Logout
        </NavLink>
      </nav>
    </div>
  );
};

export default DashboardSidebar;

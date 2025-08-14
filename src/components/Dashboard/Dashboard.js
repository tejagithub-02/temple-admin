import React from "react";
import { Link } from "react-router-dom"; // Import Link
import "./Dashboard.css";

const DashboardStats = () => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h4>WEBSITE VISITORS</h4>
        <p className="stat-value">1,245</p>
      </div>

      <div className="stat-card">
        <h4>TEMPLE BOOKINGS</h4>
        <p className="stat-value approved">5 Approved</p>
        <Link to="/temple-bookings" className="action-btn">
          View Booked Sevas
        </Link>
      </div>

      <div className="stat-card">
        <h4>EVENTS</h4>
        <p className="pending">3 Pending</p>
        <p className="approved">24 Approved</p>
        <Link to="/event-bookings" className="action-btn">
          Review Event Bookings
        </Link>
      </div>

      <div className="stat-card">
        <h4>SEVAS</h4>
        <p className="pending">0 Pending</p>
        <p className="approved">1 Approved</p>
        <button className="action-btn">Review Seva Bookings</button>
      </div>
    </div>
  );
};

export default DashboardStats;

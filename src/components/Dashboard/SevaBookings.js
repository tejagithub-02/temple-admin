import React, { useState } from "react";
import "./SevaBookings.css";

const SevaBookings = () => {
  const [filters, setFilters] = useState({
    sevaName: "",
    fromDate: "",
    toDate: "",
    status: "All Statuses",
  });

  const bookingsData = [
    {
      id: 1,
      name: "Teja",
      email: "kasanileelasasipriya@gmail.com",
      mobile: "1234567890",
      sevaName: "Lakshmi",
      date: "2025-08-29",
      amount: "₹100.00",
      paymentMethod: "QR Code - Online",
      paymentScreenshot: "-",
      ticketId: "ZJH0DAH",
      status: "Approved",
      bookedAt: "1970-01-01",
    },
    // Add more sample data for testing
    {
      id: 2,
      name: "Rahul",
      email: "rahul@example.com",
      mobile: "9876543210",
      sevaName: "Ganesh",
      date: "2025-09-01",
      amount: "₹150.00",
      paymentMethod: "Cash",
      paymentScreenshot: "-",
      ticketId: "XKJ9DAS",
      status: "Pending",
      bookedAt: "1970-01-02",
    },
    {
      id: 3,
      name: "Priya",
      email: "priya@example.com",
      mobile: "8765432109",
      sevaName: "Saraswati",
      date: "2025-09-05",
      amount: "₹200.00",
      paymentMethod: "Online Transfer",
      paymentScreenshot: "-",
      ticketId: "PLO8DZX",
      status: "Rejected",
      bookedAt: "1970-01-03",
    },
  ];

  const filteredBookings = bookingsData.filter((booking) => {
    return (
      (filters.sevaName === "" ||
        booking.sevaName.toLowerCase().includes(filters.sevaName.toLowerCase())) &&
      (filters.fromDate === "" || booking.date >= filters.fromDate) &&
      (filters.toDate === "" || booking.date <= filters.toDate) &&
      (filters.status === "All Statuses" || booking.status === filters.status)
    );
  });

  const resetFilters = () => {
    setFilters({
      sevaName: "",
      fromDate: "",
      toDate: "",
      status: "All Statuses",
    });
  };

  return (
    <div className="seva-bookings-container">
      <button className="back-btn">← Back</button>
      <h2 className="page-title">All Seva & Event Bookings</h2>

      {/* Filter Section */}
      <div className="filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Filter by Seva Name"
            value={filters.sevaName}
            onChange={(e) =>
              setFilters({ ...filters, sevaName: e.target.value })
            }
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <label>From:</label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) =>
              setFilters({ ...filters, fromDate: e.target.value })
            }
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <label>To:</label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) =>
              setFilters({ ...filters, toDate: e.target.value })
            }
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="filter-select"
          >
            <option>All Statuses</option>
            <option>Approved</option>
            <option>Pending</option>
            <option>Rejected</option>
          </select>
        </div>
        
        <div className="filter-actions">
          <button className="search-btn">Search</button>
          <button className="reset-btn" onClick={resetFilters}>Reset</button>
        </div>
      </div>

      {/* Approve All Button */}
      <div className="action-buttons">
        <button className="approve-all-btn">Approve All</button>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="seva-bookings-table">
          <thead>
            <tr>
              <th>Sl. No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Seva Name</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Payment Screenshot</th>
              <th>Ticket ID</th>
              <th>Status</th>
              <th>Booked At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b, index) => (
              <tr key={b.id}>
                <td data-label="Sl. No">{index + 1}</td>
                <td data-label="Name">{b.name}</td>
                <td data-label="Email">{b.email}</td>
                <td data-label="Mobile">{b.mobile}</td>
                <td data-label="Seva Name">{b.sevaName}</td>
                <td data-label="Date">{b.date}</td>
                <td data-label="Amount">{b.amount}</td>
                <td data-label="Payment Method">{b.paymentMethod}</td>
                <td data-label="Payment Screenshot">
                  {b.paymentScreenshot === "-" ? (
                    "-"
                  ) : (
                    <a href={b.paymentScreenshot} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  )}
                </td>
                <td data-label="Ticket ID">{b.ticketId}</td>
                <td data-label="Status">
                  <span className={`status-${b.status.toLowerCase()}`}>
                    {b.status}
                  </span>
                </td>
                <td data-label="Booked At">{b.bookedAt}</td>
                <td data-label="Action">
                  <button className="edit-btn">Edit</button>
                  {b.status === "Pending" && (
                    <button className="approve-btn">Approve</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SevaBookings;
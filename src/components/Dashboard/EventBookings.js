import React, { useState } from "react";
import "./EventBookings.css";

export default function EventBookings() {
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    seva: "",
    payment: "All",
  });

  const data = [
    {
      id: 1,
      name: "Teja",
      email: "eweewewe@hamil.ckm",
      mobile: "9618591044",
      seva: "Lakshmi Pooja",
      date: "2025-07-02",
      amount: 200.0,
      payment: "Online",
      status: "Approved",
    },
    {
      id: 2,
      name: "Ravi",
      email: "ravi@gmail.com",
      mobile: "9876543210",
      seva: "Ganesh Pooja",
      date: "2025-07-03",
      amount: 150.0,
      payment: "Cash",
      status: "Approved",
    },
    {
      id: 3,
      name: "Kiran",
      email: "kiran@gmail.com",
      mobile: "1234567890",
      seva: "Gapapati pooja",
      date: "2025-07-04",
      amount: 300.0,
      payment: "Online",
      status: "Approved",
    },
    {
      id: 4,
      name: "Maruthi",
      email: "tmaruthiteja2013@gmail.com",
      mobile: "9618591044",
      seva: "Gapapati pooja",
      date: "2025-07-01",
      amount: 100.0,
      payment: "Cash",
      status: "Approved",
    },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      from: "",
      to: "",
      seva: "",
      payment: "All",
    });
  };

  const filteredData = () => {
    let filtered = [...data];

    if (filters.from) {
      filtered = filtered.filter((b) => b.date >= filters.from);
    }
    if (filters.to) {
      filtered = filtered.filter((b) => b.date <= filters.to);
    }
    if (filters.seva) {
      filtered = filtered.filter((b) =>
        b.seva.toLowerCase().includes(filters.seva.toLowerCase())
      );
    }
    if (filters.payment !== "All") {
      filtered = filtered.filter(
        (b) => b.payment.toLowerCase() === filters.payment.toLowerCase()
      );
    }

    return filtered;
  };

  return (
    <div className="eventbookings-page">
      <div className="eventbookings-container">
        {/* Top buttons */}
        <div className="top-buttons">
          <button className="btn btn-secondary">← Back to Dashboard</button>
          <button className="btn btn-primary">Download CSV</button>
        </div>

        <h3 className="page-title">Event Bookings</h3>

        {/* Filters */}
        <div className="filter-card">
          <input
            type="date"
            name="from"
            value={filters.from}
            onChange={handleFilterChange}
          />
          <input
            type="date"
            name="to"
            value={filters.to}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="seva"
            value={filters.seva}
            onChange={handleFilterChange}
            placeholder="Search seva..."
          />
          <select
            name="payment"
            value={filters.payment}
            onChange={handleFilterChange}
          >
            <option value="All">All Payments</option>
            <option value="Cash">Cash</option>
            <option value="Online">Online</option>
          </select>
          <button className="btn btn-primary">Search</button>
          <button className="btn btn-secondary" onClick={resetFilters}>
            Reset
          </button>
        </div>

        {/* Approve All */}
        <div className="approve-all">
          <button className="btn btn-success">Approve All Pending</button>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>MOBILE</th>
                <th>SEVA</th>
                <th>DATE</th>
                <th>AMOUNT</th>
                <th>PAYMENT</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredData().map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.name}</td>
                  <td>{b.email}</td>
                  <td>{b.mobile}</td>
                  <td>{b.seva}</td>
                  <td>{b.date}</td>
                  <td>{b.amount.toFixed(2)}</td>
                  <td>{b.payment}</td>
                  <td className="status-approved">{b.status}</td>
                  <td>
                    <button className="btn btn-primary btn-sm">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

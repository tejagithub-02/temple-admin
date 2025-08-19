import React, { useState } from "react";
import "./SevaBookings.css";

export default function SevaBookings() {
  const [filters, setFilters] = useState({
    seva: "",
    fromDate: "",
    toDate: "",
    status: "All",
    payment: "All",
  });

  const [bookings, setBookings] = useState([
    {
      id: 1,
      name: "Teja",
      email: "teja@example.com",
      mobile: "9876543210",
      seva: "Abhishekam",
      sevadate: "2025-08-20",
      gotra: "Kashyapa",
      nakshatra: "Rohini",
      raashi: "Vrishabha",
      district: "Hyderabad",
      state: "Telangana",
      address: "Ameerpet, Hyderabad",
      pincode: "500016",
      bookeddate: "2025-08-18",
      amount: 500,
      payment: "Online",
      screenshot: "dummy.png",
      status: "Pending",
    },
    {
      id: 2,
      name: "Priya",
      email: "priya@example.com",
      mobile: "9876501234",
      seva: "Archana",
      sevadate: "2025-08-21",
      gotra: "Vasishta",
      nakshatra: "Ashwini",
      raashi: "Mesha",
      district: "Chennai",
      state: "Tamil Nadu",
      address: "Adyar, Chennai",
      pincode: "600020",
      bookeddate: "2025-08-17",
      amount: 300,
      payment: "Cash",
      screenshot: "dummy.png",
      status: "Approved",
    },
  ]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      seva: "",
      fromDate: "",
      toDate: "",
      status: "All",
      payment: "All",
    });
  };

  const filteredBookings = bookings.filter((b) => {
    const afterFrom = !filters.fromDate || b.sevadate >= filters.fromDate;
    const beforeTo = !filters.toDate || b.sevadate <= filters.toDate;

    return (
      (!filters.seva || b.seva.toLowerCase().includes(filters.seva.toLowerCase())) &&
      afterFrom &&
      beforeTo &&
      (filters.status === "All" || b.status === filters.status) &&
      (filters.payment === "All" || b.payment === filters.payment)
    );
  });

  const totalAmount = filteredBookings.reduce((sum, b) => sum + b.amount, 0);

  const approveAll = () => {
    const updatedBookings = bookings.map((b) =>
      b.status === "Pending" ? { ...b, status: "Approved" } : b
    );
    setBookings(updatedBookings);
  };

  const downloadCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Mobile",
      "Seva",
      "Seva Date",
      "Gotra",
      "Nakshatra",
      "Raashi",
      "District",
      "State",
      "Address",
      "Pincode",
      "Booked Date",
      "Amount",
      "Payment",
      "Screenshot",
      "Status",
    ];

    const rows = filteredBookings.map((b) => [
      b.id,
      b.name,
      b.email,
      b.mobile,
      b.seva,
      b.sevadate,
      b.gotra,
      b.nakshatra,
      b.raashi,
      b.district,
      b.state,
      b.address,
      b.pincode,
      b.bookeddate,
      b.amount,
      b.payment,
      `${window.location.origin}/uploads/${b.screenshot}`,
      b.status,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "seva_bookings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="seva-bookings">
      <h2 className="page-heading">Seva Bookings</h2>

      {/* Filters */}
      <div className="filters">
        <div className="form-group">
          <label>Seva</label>
          <input
            type="text"
            name="seva"
            value={filters.seva}
            onChange={handleFilterChange}
            placeholder="Enter seva name"
          />
        </div>
        <div className="form-group">
          <label>From Date</label>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
          />
        </div>
        <div className="form-group">
          <label>To Date</label>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="form-group">
          <label>Payment</label>
          <select
            name="payment"
            value={filters.payment}
            onChange={handleFilterChange}
          >
            <option value="All">All</option>
            <option value="Online">Online</option>
            <option value="Cash">Cash</option>
          </select>
        </div>
        <div className="form-group filter-actions">
          <button className="btn btn-primary">Search</button>
          <button className="btn btn-secondary" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </div>

      {/* Approve All, Total Amount & CSV Download */}
      <div className="approve-total">
        <button className="btn btn-success" onClick={approveAll}>
          Approve All Pending
        </button>
        <button className="btn btn-info" onClick={downloadCSV}>
          Download CSV
        </button>
        <span className="total-amount">
          Total Amount: ₹{totalAmount.toFixed(2)}
        </span>
      </div>

      {/* Scrollable Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>MOBILE</th>
              <th>SEVA</th>
              <th>SEVA-DATE</th>
              <th>GOTRA</th>
              <th>NAKSHATRA</th>
              <th>RAASHI</th>
              <th>DISTRICT</th>
              <th>STATE</th>
              <th>ADDRESS</th>
              <th>PINCODE</th>
              <th>BOOKED-DATE</th>
              <th>AMOUNT</th>
              <th>PAYMENT</th>
              <th>SCREENSHOT</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.name}</td>
                <td className="email-cell">{b.email}</td>
                <td>{b.mobile}</td>
                <td>{b.seva}</td>
                <td>{b.sevadate}</td>
                <td>{b.gotra}</td>
                <td>{b.nakshatra}</td>
                <td>{b.raashi}</td>
                <td>{b.district}</td>
                <td>{b.state}</td>
                <td>{b.address}</td>
                <td>{b.pincode}</td>
                <td>{b.bookeddate}</td>
                <td>₹{b.amount.toFixed(2)}</td>
                <td>{b.payment}</td>
                <td>
                  <img
                    src={`uploads/${b.screenshot}`}
                    alt="screenshot"
                    width="60"
                  />
                </td>
                <td
                  className={
                    b.status === "Approved"
                      ? "status-approved"
                      : b.status === "Rejected"
                      ? "status-rejected"
                      : "status-pending"
                  }
                >
                  {b.status}
                </td>
                <td>
                  <button className="btn btn-primary btn-sm">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

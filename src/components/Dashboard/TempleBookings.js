import React, { useState, useEffect } from "react";
import "./TempleBookings.css";

const TempleBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");

  // Load mock data for testing
  useEffect(() => {
    const mockData = [
      { id: 1, name: "Rajesh Kumar", email: "rajesh@example.com", mobile: "9876543210", seva: "Archana", date: "2025-08-10", amount: 500, payment: "QR Code Payment", status: "Approved" },
      { id: 2, name: "Sita Devi", email: "sita@example.com", mobile: "9123456789", seva: "Abhishekam", date: "2025-08-08", amount: 1000, payment: "Cash", status: "Pending" },
      { id: 3, name: "Vishnu Prasad", email: "vishnu@example.com", mobile: "9988776655", seva: "Deepa Aradhana", date: "2025-08-09", amount: 300, payment: "QR Code Payment", status: "Approved" },
      { id: 4, name: "Lakshmi Narayan", email: "lakshmi@example.com", mobile: "9090909090", seva: "Annadanam", date: "2025-08-07", amount: 1500, payment: "Cash", status: "Pending" }
    ];
    setBookings(mockData);
    setFilteredBookings(mockData);
  }, []);

  const handleSearch = () => {
    let result = bookings;

    if (fromDate) {
      result = result.filter(b => new Date(b.date) >= new Date(fromDate));
    }
    if (toDate) {
      result = result.filter(b => new Date(b.date) <= new Date(toDate));
    }
    if (searchTerm) {
      result = result.filter(b =>
        b.seva.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (paymentFilter !== "All") {
      result = result.filter(b => b.payment === paymentFilter);
    }

    setFilteredBookings(result);
  };

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setSearchTerm("");
    setPaymentFilter("All");
    setFilteredBookings(bookings);
  };

  const approveAllPending = () => {
    const updated = bookings.map(b =>
      b.status === "Pending" ? { ...b, status: "Approved" } : b
    );
    setBookings(updated);
    setFilteredBookings(updated);
  };

  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Name,Email,Mobile,Seva,Date,Amount,Payment,Status"]
        .concat(
          filteredBookings.map(
            b =>
              `${b.id},${b.name},${b.email},${b.mobile},${b.seva},${b.date},${b.amount},${b.payment},${b.status}`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bookings.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="bookings-container">
      <div className="actions-header">
        <button className="back-btn" onClick={() => window.history.back()}>
          ← Back to Dashboard
        </button>
        <button className="download-btn" onClick={downloadCSV}>
          Download CSV
        </button>
      </div>

      <h2>All Temple Bookings</h2>

      <div className="filters scroll-filters">
        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
        />
        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search seva..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          value={paymentFilter}
          onChange={e => setPaymentFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="QR Code Payment">QR Code Payment</option>
          <option value="Cash">Cash</option>
        </select>
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
        <button className="reset-btn" onClick={resetFilters}>
          Reset
        </button>
      </div>

      <button className="approve-all-btn" onClick={approveAllPending}>
        Approve All Pending
      </button>

      <table className="bookings-table">
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
          {filteredBookings.length > 0 ? (
            filteredBookings.map(b => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.name}</td>
                <td>{b.email}</td>
                <td>{b.mobile}</td>
                <td>{b.seva}</td>
                <td>{b.date}</td>
                <td>{b.amount}</td>
                <td>{b.payment}</td>
                <td
                  style={{
                    color: b.status === "Approved" ? "green" : "red",
                    fontWeight: "bold"
                  }}
                >
                  {b.status}
                </td>
                <td>
                  <button className="edit-btn">Edit</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TempleBookings;

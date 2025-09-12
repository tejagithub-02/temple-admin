import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SevaBookings.css";

const API_BASE = process.env.REACT_APP_BACKEND_API; // must end with /
const token = localStorage.getItem("userToken");

const axiosAuth = axios.create({
  baseURL: `${API_BASE}api/savabooking`,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  },
});

export default function SevaBookings() {
  const [filters, setFilters] = useState({
    seva: "All",
    fromDate: "",
    toDate: "",
    status: "All",
    payment: "All",
    sevaType: "All", 
    mobile:"",
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sevaOptions, setSevaOptions] = useState([]); 
  // ✅ Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosAuth.get("/getAll");
        if (res.data?.data) {
          const mapped = res.data.data.map((b, idx) => ({
            id: idx + 1,
            name: b.karta_name,
            mobile: b.phone,
            sevatype: b.sava_id?.category || "N/A",
            seva: b.sava_id?.name || "N/A",
            sevadate: (() => {
              if (b.sava_id?.category === "Event-Specific Sevas" && b.sava_id?.date) {
                return new Date(b.sava_id.date).toISOString().split("T")[0];
              } else if (b.sava_id?.category === "General Sevas") {
                if (b.from_booking_date && b.to_booking_date) {
                  const from = new Date(b.from_booking_date).toISOString().split("T")[0];
                  const to = new Date(b.to_booking_date).toISOString().split("T")[0];
                  return from === to ? from : `${from} → ${to}`;
                } else if (b.from_booking_date) {
                  return new Date(b.from_booking_date).toISOString().split("T")[0];
                }
              }
              return "N/A";
            })(),
            gotra: b.gotra,
            nakshatra: b.nakshatra,
            raashi: b.raashi,
            district: b.district,
            state: b.state,
            address: b.address,
            pincode: b.pincode,
            amount: b.sava_id?.price || 0,
            payment: b.booking_type,
            status: b.status,
          }));

          const upiAndOffline = mapped.filter(
            (b) =>
              b.payment?.toLowerCase() === "upi" ||
              b.payment?.toLowerCase() === "offline"
          );

          setBookings(upiAndOffline);

          // ✅ Get unique seva names for dropdown
          const uniqueSevas = [...new Set(upiAndOffline.map((b) => b.seva))];
          setSevaOptions(uniqueSevas);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      seva: "All",
      fromDate: "",
      toDate: "",
      status: "All",
      payment: "All",
      sevaType: "All",
      mobile: "",
    });
  };

  const filteredBookings = bookings
  .filter((b) => {
    const afterFrom = !filters.fromDate || b.sevadate >= filters.fromDate;
    const beforeTo = !filters.toDate || b.sevadate <= filters.toDate;

    return (
      (filters.seva === "All" || b.seva === filters.seva) &&
      (!filters.mobile ||
        b.mobile?.toLowerCase().includes(filters.mobile.toLowerCase())) &&
      afterFrom &&
      beforeTo &&
      (filters.status === "All" || b.status === filters.status) &&
      (filters.payment === "All" || b.payment === filters.payment) &&
      (filters.sevaType === "All" || b.sevatype === filters.sevaType)
    );
  })
  .map((b, index) => ({ ...b, id: index + 1 })); // reset ID starting from 1

  

  const totalAmount = filteredBookings.reduce((sum, b) => sum + b.amount, 0);

  // ✅ CSV download
  const downloadCSV = () => {
    const headers = [
      "SI NO",
      "Name",
      "Mobile",
      "Seva",
      "Seva Type",
      "Seva Date",
      "Gotra",
      "Nakshatra",
      "Raashi",
      "District",
      "State",
      "Address",
      "Pincode",
      "Amount",
      "Payment",
      "Status",
    ];

    const rows = filteredBookings.map((b) => [
      b.id,
      b.name,
      b.mobile,
      b.seva,
      b.sevatype,
      b.sevadate,
      b.gotra,
      b.nakshatra,
      b.raashi,
      b.district,
      b.state,
      b.address,
      b.pincode,
      b.amount,
      b.payment,
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
      <h2 className="page-heading">Temple Bookings</h2>

      
       

      {/* Filters */}
      <div className="filters">

         {/* ✅ New Seva Type Filter */}
         <div className="form-group">
          <label>Seva Type</label>
          <select
            name="sevaType"
            value={filters.sevaType}
            onChange={handleFilterChange}
          >
            <option value="All">All</option>
            <option value="General Sevas">General Sevas</option>
            <option value="Event-Specific Sevas">Event-Specific Sevas</option>
          </select>
        </div>

        <div className="form-group">
  <label>Seva</label>
  <select
    name="seva"
    value={filters.seva}
    onChange={handleFilterChange}
  >
    <option value="All">All</option>
    {sevaOptions.map((s, idx) => (
      <option key={idx} value={s}>
        {s}
      </option>
    ))}
  </select>
</div>

        <div className="form-group">
  <label>Mobile</label>
  <input
    type="text"
    name="mobile"
    value={filters.mobile}
    onChange={handleFilterChange}
    placeholder="Enter mobile number"
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
          <label>Payment</label>
          <select
            name="payment"
            value={filters.payment}
            onChange={handleFilterChange}
          >
            <option value="All">All</option>
            <option value="UPI">UPI</option>
            <option value="offline">Cash</option>
          </select>
        </div>


        <div className="form-group filter-actions">
          <button className="btn btn-secondary" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </div>

      {/* Download & Summary */}
      <div className="approve-total">
        <button className="btn btn-info" onClick={downloadCSV}>
          Download CSV
        </button>
        <span className="total-amount">
          Total Amount: ₹{totalAmount.toFixed(2)}
        </span>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <p>Loading bookings...</p>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>SI NO</th>
                <th>NAME</th>
                <th>MOBILE</th>
                <th>SEVA</th>
                <th>SEVA TYPE</th>
                <th>DATE</th>
                <th>GOTRA</th>
                <th>NAKSHATRA</th>
                <th>RAASHI</th>
                <th>DISTRICT</th>
                <th>STATE</th>
                <th>ADDRESS</th>
                <th>PINCODE</th>
                <th>AMOUNT</th>
                <th>PAYMENT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.name}</td>
                  <td>{b.mobile}</td>
                  <td>{b.seva}</td>
                  <td>{b.sevatype}</td>
                  <td>{b.sevadate}</td>
                  <td>{b.gotra}</td>
                  <td>{b.nakshatra}</td>
                  <td>{b.raashi}</td>
                  <td>{b.district}</td>
                  <td>{b.state}</td>
                  <td>{b.address}</td>
                  <td>{b.pincode}</td>
                  <td>₹{b.amount.toFixed(2)}</td>
                  <td>{b.payment}</td>
                  <td>{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./SevaBookings.css";

export default function SevaBookings() {
  const [filters, setFilters] = useState({
    sevaType: "All",
    seva: "All",
    fromDate: "",
    toDate: "",
    status: "All",
    mobile: "",
    
  });

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewImage, setViewImage] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [sevaOptions, setSevaOptions] = useState([]);

  const API_BASE = process.env.REACT_APP_BACKEND_API;
  const token = localStorage.getItem("userToken");

  const axiosAuth = axios.create({
    baseURL: `${API_BASE}api/savabooking`,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  // Fetch bookings
  useEffect(() => {
    fetchBookings();
  }, []);

   const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axiosAuth.get("/getAll");
      if (res.data.success) {
        const mapped = res.data.data.map((b) => ({
          id: b._id,
          name: b.karta_name,
          mobile: b.phone,
          sevaType: b.sava_id?.category || "",  
          seva: b.sava_id?.name || "",
          sevadate: b.sava_id?.date?.split("T")[0] || b.from_booking_date?.split("T")[0],
          gotra: b.gotra,
          nakshatra: b.nakshatra,
          raashi: b.raashi,
          district: b.district,
          state: b.state,
          address: b.address,
          pincode: b.pincode,
          bookeddate: b.createdAt?.split("T")[0],
          amount: b.sava_id?.price || 0,
          payment: b.booking_type || "N/A",
          screenshot: b.payment_screenshot,
          status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
        }));
        setBookings(mapped);

        // ✅ Populate unique seva names
        const uniqueSevas = [...new Set(mapped.map((b) => b.seva).filter(Boolean))];
        setSevaOptions(uniqueSevas);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };


  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });
  

  const updateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const res = await axiosAuth.patch(`/updateBookingStatus/${id}`, {
        status: newStatus.toLowerCase(),
      });
      if (res.data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
  
        // ✅ Toast notification
        Toast.fire({
          icon: "success",
          title: `Booking ${newStatus} successfully!`,
        });
      }
    } catch (err) {
      console.error("Error updating status:", err.response?.data || err.message);
      Toast.fire({
        icon: "error",
        title: `Failed to ${newStatus.toLowerCase()} booking!`,
      });
    } finally {
      setUpdatingId(null);
    }
  };
  

  // Filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      sevaType: "All",
      seva: "All",
      fromDate: "",
      toDate: "",
      status: "All",
      mobile:"",
    });
  };

  const filteredBookings = bookings.filter((b) => {
    const afterFrom = !filters.fromDate || b.sevadate >= filters.fromDate;
    const beforeTo = !filters.toDate || b.sevadate <= filters.toDate;
  
    return (
      (filters.sevaType === "All" || b.sevaType === filters.sevaType) &&
      (filters.seva === "All" || b.seva === filters.seva) &&   // ✅ dropdown filter
      (!filters.mobile || b.mobile?.toLowerCase().includes(filters.mobile.toLowerCase())) && // ✅ mobile filter
      afterFrom &&
      beforeTo &&
      (filters.status === "All" || b.status === filters.status)
    );
  });
  
  

  const totalAmount = filteredBookings
  .filter((b) => b.payment?.toLowerCase() === "online")  // only online like table
  .reduce((sum, b) => sum + b.amount, 0);

  const approveAll = async () => {
    const toApprove = filteredBookings.filter((b) => b.status !== "Approved");
    if (toApprove.length === 0) {
      Toast.fire({
        icon: "info",
        title: "All visible bookings are already approved!",
      });
      return;
    }
    for (const b of toApprove) {
      await updateStatus(b.id, "Approved");
    }
    Toast.fire({
      icon: "success",
      title: "All visible bookings approved successfully!",
    });
  };
  

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div className="seva-bookings">
      <h2 className="page-heading">Seva Bookings</h2>

      <div className="filters">
      <div className="form-group">
  <label>Seva Type</label>
  <select name="sevaType" value={filters.sevaType} onChange={handleFilterChange}>
    <option value="All">All</option>
    <option value="General Sevas">General Sevas</option>
    <option value="Event-Specific Sevas">Event-Specific Sevas</option>
  </select>
</div>

  <div className="form-group">
    <label>Seva</label>
    <select name="seva" value={filters.seva} onChange={handleFilterChange}>
      <option value="All">All</option>
      {sevaOptions.map((s, idx) => (
        <option key={idx} value={s}>{s}</option>
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
    <input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} />
  </div>

  <div className="form-group">
    <label>To Date</label>
    <input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} />
  </div>

  <div className="form-group">
    <label>Status</label>
    <select name="status" value={filters.status} onChange={handleFilterChange}>
      <option value="All">All</option>
      <option value="Pending">Pending</option>
      <option value="Approved">Approved</option>
      <option value="Rejected">Rejected</option>
    </select>
  </div>

  <div className="form-group filter-actions">
    <button className="btn btn-secondary" onClick={resetFilters}>Reset</button>
  </div>
</div>


      {/* Approve All & Total Amount */}
      <div className="approve-total">
        <button className="btn btn-success" onClick={approveAll} disabled={updatingId !== null}>
          Approve All Pending
        </button>
        <span className="total-amount">Total Amount: ₹{totalAmount.toFixed(2)}</span>
      </div>

      {/* Image Modal */}
      {viewImage && (
        <div className="image-modal" onClick={() => setViewImage(null)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={() => setViewImage(null)}>✕</button>
            <img src={viewImage} alt="Full view" />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>SI NO</th>
              <th>ID</th>
              <th>KARTA NAME</th>
              <th>MOBILE</th>
              <th>SEVA TYPE</th>
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
          {filteredBookings
  .filter((b) => b.payment?.toLowerCase() === "online")  // ✅ only online rows
  .map((b, index) => (
    <tr key={b.id}>
      <td>{index + 1}</td>
      <td>{b.id}</td>
      <td>{b.name}</td>
      <td>{b.mobile}</td>
      <td>{b.sevaType}</td>
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
        {b.screenshot && (
          <img
            src={b.screenshot}
            alt="screenshot"
            width="60"
            height="60"
            style={{ cursor: "pointer" }}
            onClick={() => setViewImage(b.screenshot)}
          />
        )}
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
        <button
          className="btn btn-success btn-sm"
          onClick={() => updateStatus(b.id, "Approved")}
          disabled={updatingId === b.id}
        >
          {updatingId === b.id && b.status !== "Approved"
            ? "Approving..."
            : "Approve"}
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => updateStatus(b.id, "Rejected")}
          disabled={updatingId === b.id}
        >
          {updatingId === b.id && b.status !== "Rejected"
            ? "Rejecting..."
            : "Reject"}
        </button>
      </td>
    </tr>
  ))}

          </tbody>
        </table>
      </div>
    </div>
  );
}

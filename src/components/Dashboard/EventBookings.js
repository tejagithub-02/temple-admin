import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./EventBookings.css";

export default function EventBookings() {
  const [filters, setFilters] = useState({
    seva: "",
    fromDate: "",
    toDate: "",
    status: "All",
  });

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewImage, setViewImage] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const API_BASE = process.env.REACT_APP_BACKEND_API;
  const token = localStorage.getItem("userToken");

  const axiosAuth = axios.create({
    baseURL: `${API_BASE}api/eventbooking`,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  // ✅ Toast setup
  const showToast = (message, icon = "success") => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title: message,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axiosAuth.get(`/getBookings`);
      if (res.data.success) {
        const mapped = res.data.data.map((b) => ({
          id: b._id,
          name: b.karta_name,
          mobile: b.phone,
          seva: b.pooja?.name || "",
          sevadate: b.pooja?.date?.split("T")[0],
          gotra: b.gotra,
          nakshatra: b.nakshatra,
          raashi: b.raashi,
          district: b.district,
          state: b.state,
          address: b.address,
          pincode: b.pincode,
          bookeddate: b.createdAt?.split("T")[0],
          amount: b.pooja?.price || 0,
          payment: b.payment_screenshot ? "Online" : "Cash",
          screenshot: b.payment_screenshot,
          status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
          eventName: b.event_id?.event_name,
        }));
        setBookings(mapped);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err.response?.data || err.message);
      showToast("Error fetching bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id);
  
    // Show initial processing toast
    const toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timerProgressBar: true,
    });
    
    toast.fire({
      icon: "info",
      title: `${newStatus} in progress...`,
      timer: 10000,
    });
  
    try {
      const res = await axiosAuth.patch(`/updateBookingStatus/${id}`, {
        bookingId: id,
        status: newStatus.toLowerCase(),
      });
  
      if (res.data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
  
        // Update toast to success
        toast.fire({
          icon: "success",
          title: `Booking ${newStatus} successfully!`,
          timer: 2500,
        });
      } else {
        toast.fire({
          icon: "error",
          title: `Failed to update status`,
          timer: 2500,
        });
      }
    } catch (err) {
      console.error("Error updating status:", err.response?.data || err.message);
      toast.fire({
        icon: "error",
        title: "Error updating status",
        timer: 2500,
      });
    } finally {
      setUpdatingId(null);
    }
  };
  

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
    });
    showToast("Filters reset", "info");
  };

  const filteredBookings = bookings.filter((b) => {
    const afterFrom = !filters.fromDate || b.sevadate >= filters.fromDate;
    const beforeTo = !filters.toDate || b.sevadate <= filters.toDate;

    return (
      (!filters.seva ||
        b.seva.toLowerCase().includes(filters.seva.toLowerCase())) &&
      afterFrom &&
      beforeTo &&
      (filters.status === "All" || b.status === filters.status)
    );
  });

  const totalAmount = filteredBookings.reduce((sum, b) => sum + b.amount, 0);

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div className="seva-bookings">
      <h2 className="page-heading">Event Bookings</h2>

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

        <div className="form-group filter-actions">
          <button className="btn btn-secondary" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </div>

      {/* Total Amount */}
      <div className="approve-total">
        <span className="total-amount">
          Total Amount: ₹{totalAmount.toFixed(2)}
        </span>
      </div>

      {/* Approve All */}
      <div className="approve-all-container">
        <button
          className="btn-approve-all"
          onClick={async () => {
            const toApprove = filteredBookings.filter(b => b.status !== "Approved");
            if (toApprove.length === 0) {
              showToast("All visible bookings are already approved!", "info");
              return;
            }

            for (const b of toApprove) {
              await updateStatus(b.id, "Approved");
            }
            showToast("All visible bookings approved successfully!", "success");
          }}
          disabled={updatingId !== null}
        >
          Approve All
        </button>
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
            {filteredBookings.map((b, index) => (
              <tr key={b.id}>
                <td>{index + 1}</td>
                <td>{b.id}</td>
                <td>{b.name}</td>
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
                    src={b.screenshot}
                    alt="screenshot"
                    width="60"
                    height="60"
                    style={{ cursor: "pointer" }}
                    onClick={() => setViewImage(b.screenshot)}
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

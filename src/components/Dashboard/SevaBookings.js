import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./SevaBookings.css";

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("seva"); // "seva" | "event"

  // ---------- Shared States ----------
  const [loading, setLoading] = useState(true);
  const [viewImage, setViewImage] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // ---------- Seva Bookings ----------
  const [sevaFilters, setSevaFilters] = useState({
    sevaType: "All",
    seva: "All",
    fromDate: "",
    toDate: "",
    status: "All",
    mobile: "",
  });
  const [sevaBookings, setSevaBookings] = useState([]);
  const [sevaOptions, setSevaOptions] = useState([]);

  // ---------- Event Bookings ----------
  const [eventFilters, setEventFilters] = useState({
    seva: "All",
    fromDate: "",
    toDate: "",
    status: "All",
    mobile: "",
  });
  const [eventBookings, setEventBookings] = useState([]);
  const [eventSevas, setEventSevas] = useState([]);

  // ---------- API Setup ----------
  const API_BASE = process.env.REACT_APP_BACKEND_API;
  const token = localStorage.getItem("userToken");

  const sevaAxios = axios.create({
    baseURL: `${API_BASE}api/savabooking`,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  const eventAxios = axios.create({
    baseURL: `${API_BASE}api/eventbooking`,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  // ---------- Toast ----------
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  // ---------- Fetch Bookings ----------
  useEffect(() => {
    fetchSevaBookings();
    fetchEventBookings();
  }, []);

  const fetchSevaBookings = async () => {
    try {
      setLoading(true);
      const res = await sevaAxios.get("/getAll");
      if (res.data.success) {
        const mapped = res.data.data.map((b) => ({
          id: b._id,
          name: b.karta_name,
          mobile: b.phone,
          sevaType: b.sava_id?.category || "",
          seva: b.sava_id?.name || "",
          sevadate:
            b.sava_id?.date?.split("T")[0] ||
            b.from_booking_date?.split("T")[0],
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
        setSevaBookings(mapped);
        setSevaOptions([
          ...new Set(mapped.map((b) => b.seva).filter(Boolean)),
        ]);
      }
    } catch (err) {
      console.error("Error fetching seva bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventBookings = async () => {
    try {
      setLoading(true);
      const res = await eventAxios.get("/getBookings");
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
        setEventBookings(mapped);
        setEventSevas([
          ...new Set(mapped.map((b) => b.seva).filter(Boolean)),
        ]);
      }
    } catch (err) {
      console.error("Error fetching event bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Status Update ----------
  const updateSevaStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const res = await sevaAxios.patch(`/updateBookingStatus/${id}`, {
        status: newStatus.toLowerCase(),
      });
      if (res.data.success) {
        setSevaBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
        Toast.fire({ icon: "success", title: `Booking ${newStatus}!` });
      }
    } catch (err) {
      console.error("Error updating seva status:", err);
      Toast.fire({ icon: "error", title: "Failed to update!" });
    } finally {
      setUpdatingId(null);
    }
  };

  const updateEventStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const res = await eventAxios.patch(`/updateBookingStatus/${id}`, {
        bookingId: id,
        status: newStatus.toLowerCase(),
      });
      if (res.data.success) {
        setEventBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
        Toast.fire({ icon: "success", title: `Booking ${newStatus}!` });
      }
    } catch (err) {
      console.error("Error updating event status:", err);
      Toast.fire({ icon: "error", title: "Failed to update!" });
    } finally {
      setUpdatingId(null);
    }
  };

  // ---------- Filters ----------
  const handleSevaFilterChange = (e) => {
    const { name, value } = e.target;
    setSevaFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleEventFilterChange = (e) => {
    const { name, value } = e.target;
    setEventFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetSevaFilters = () => {
    setSevaFilters({
      sevaType: "All",
      seva: "All",
      fromDate: "",
      toDate: "",
      status: "All",
      mobile: "",
    });
  };

  const resetEventFilters = () => {
    setEventFilters({
      seva: "All",
      fromDate: "",
      toDate: "",
      status: "All",
      mobile: "",
    });
  };

  const filteredSevaBookings = sevaBookings.filter((b) => {
    const afterFrom = !sevaFilters.fromDate || b.sevadate >= sevaFilters.fromDate;
    const beforeTo = !sevaFilters.toDate || b.sevadate <= sevaFilters.toDate;
    return (
      (sevaFilters.sevaType === "All" || b.sevaType === sevaFilters.sevaType) &&
      (sevaFilters.seva === "All" || b.seva === sevaFilters.seva) &&
      (!sevaFilters.mobile ||
        b.mobile?.toLowerCase().includes(sevaFilters.mobile.toLowerCase())) &&
      afterFrom &&
      beforeTo &&
      (sevaFilters.status === "All" || b.status === sevaFilters.status)
    );
  });

  const filteredEventBookings = eventBookings.filter((b) => {
    const afterFrom = !eventFilters.fromDate || b.sevadate >= eventFilters.fromDate;
    const beforeTo = !eventFilters.toDate || b.sevadate <= eventFilters.toDate;
    return (
      (eventFilters.seva === "All" || b.seva === eventFilters.seva) &&
      (!eventFilters.mobile ||
        b.mobile?.toLowerCase().includes(eventFilters.mobile.toLowerCase())) &&
      afterFrom &&
      beforeTo &&
      (eventFilters.status === "All" || b.status === eventFilters.status)
    );
  });

  const totalSevaAmount = filteredSevaBookings
    .filter((b) => b.payment?.toLowerCase() === "online")
    .reduce((sum, b) => sum + b.amount, 0);

  const totalEventAmount = filteredEventBookings.reduce(
    (sum, b) => sum + b.amount,
    0
  );

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div className="seva-bookings">
      <h2 className="page-heading">Bookings Management</h2>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "seva" ? "active" : ""}
          onClick={() => setActiveTab("seva")}
        >
          Seva Bookings
        </button>
        <button
          className={activeTab === "event" ? "active" : ""}
          onClick={() => setActiveTab("event")}
        >
          Pooja Bookings
        </button>
      </div>

      {/* Seva Bookings */}
      {activeTab === "seva" && (
        <>
          {/* Filters */}
          <div className="filters">
            <div className="form-group">
              <label>Seva Type</label>
              <select
                name="sevaType"
                value={sevaFilters.sevaType}
                onChange={handleSevaFilterChange}
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
                value={sevaFilters.seva}
                onChange={handleSevaFilterChange}
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
                value={sevaFilters.mobile}
                onChange={handleSevaFilterChange}
              />
            </div>
            <div className="form-group">
              <label>From Date</label>
              <input
                type="date"
                name="fromDate"
                value={sevaFilters.fromDate}
                onChange={handleSevaFilterChange}
              />
            </div>
            <div className="form-group">
              <label>To Date</label>
              <input
                type="date"
                name="toDate"
                value={sevaFilters.toDate}
                onChange={handleSevaFilterChange}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={sevaFilters.status}
                onChange={handleSevaFilterChange}
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="form-group filter-actions">
              <button className="btn btn-secondary" onClick={resetSevaFilters}>
                Reset
              </button>
            </div>
          </div>

          {/* Approve All & Total */}
          <div className="approve-total">
            <button
              className="btn btn-success"
              onClick={async () => {
                const toApprove = filteredSevaBookings.filter(
                  (b) => b.status !== "Approved"
                );
                for (const b of toApprove) {
                  await updateSevaStatus(b.id, "Approved");
                }
              }}
              disabled={updatingId !== null}
            >
              Approve All Pending
            </button>
            <span className="total-amount">
              Total Amount: ₹{totalSevaAmount.toFixed(2)}
            </span>
          </div>

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
                {filteredSevaBookings
                  .filter((b) => b.payment?.toLowerCase() === "online")
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
                          onClick={() => updateSevaStatus(b.id, "Approved")}
                          disabled={updatingId === b.id}
                        >
                          {updatingId === b.id && b.status !== "Approved"
                            ? "Approving..."
                            : "Approve"}
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => updateSevaStatus(b.id, "Rejected")}
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
        </>
      )}

      {/* Event Bookings */}
      {activeTab === "event" && (
        <>
          {/* Filters */}
          <div className="filters">
            <div className="form-group">
              <label>Seva</label>
              <select
                name="seva"
                value={eventFilters.seva}
                onChange={handleEventFilterChange}
              >
                <option value="All">All</option>
                {eventSevas.map((s, idx) => (
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
                value={eventFilters.mobile}
                onChange={handleEventFilterChange}
              />
            </div>
            <div className="form-group">
              <label>From Date</label>
              <input
                type="date"
                name="fromDate"
                value={eventFilters.fromDate}
                onChange={handleEventFilterChange}
              />
            </div>
            <div className="form-group">
              <label>To Date</label>
              <input
                type="date"
                name="toDate"
                value={eventFilters.toDate}
                onChange={handleEventFilterChange}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={eventFilters.status}
                onChange={handleEventFilterChange}
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="form-group filter-actions">
              <button className="btn btn-secondary" onClick={resetEventFilters}>
                Reset
              </button>
            </div>
          </div>

          {/* Approve All & Total */}
          <div className="approve-total">
            <button
              className="btn btn-success"
              onClick={async () => {
                const toApprove = filteredEventBookings.filter(
                  (b) => b.status !== "Approved"
                );
                for (const b of toApprove) {
                  await updateEventStatus(b.id, "Approved");
                }
              }}
              disabled={updatingId !== null}
            >
              Approve All
            </button>
            <span className="total-amount">
              Total Amount: ₹{totalEventAmount.toFixed(2)}
            </span>
          </div>

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
                {filteredEventBookings.map((b, index) => (
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
                        onClick={() => updateEventStatus(b.id, "Approved")}
                        disabled={updatingId === b.id}
                      >
                        {updatingId === b.id && b.status !== "Approved"
                          ? "Approving..."
                          : "Approve"}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => updateEventStatus(b.id, "Rejected")}
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
        </>
      )}

      {/* Image Modal */}
      {viewImage && (
        <div className="image-modal" onClick={() => setViewImage(null)}>
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="image-modal-close"
              onClick={() => setViewImage(null)}
            >
              ✕
            </button>
            <img src={viewImage} alt="Full view" />
          </div>
        </div>
      )}
    </div>
  );
}



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import "./SevaBookings.css";

// export default function CombinedBookings() {
//   const [filters, setFilters] = useState({
//     type: "All",   // ✅ Seva / Event filter
//     seva: "All",
//     fromDate: "",
//     toDate: "",
//     status: "All",
//     mobile: "",
//   });

//   const [bookings, setBookings] = useState([]);
//   const [sevas, setSevas] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [viewImage, setViewImage] = useState(null);
//   const [updatingId, setUpdatingId] = useState(null);

//   const API_BASE = process.env.REACT_APP_BACKEND_API;
//   const token = localStorage.getItem("userToken");

//   const axiosSeva = axios.create({
//     baseURL: `${API_BASE}api/savabooking`,
//     headers: { Authorization: token ? `Bearer ${token}` : "" },
//   });

//   const axiosEvent = axios.create({
//     baseURL: `${API_BASE}api/eventbooking`,
//     headers: { Authorization: token ? `Bearer ${token}` : "" },
//   });

//   const showToast = (message, icon = "success") => {
//     Swal.fire({
//       toast: true,
//       position: "top-end",
//       icon,
//       title: message,
//       showConfirmButton: false,
//       timer: 2500,
//       timerProgressBar: true,
//     });
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const fetchBookings = async () => {
//     try {
//       setLoading(true);

//       // ✅ Fetch Seva bookings
//       const sevaRes = await axiosSeva.get("/getAll");
//       const sevaBookings = sevaRes.data.success
//         ? sevaRes.data.data.map((b) => ({
//             id: b._id,
//             type: "Seva",
//             name: b.karta_name,
//             mobile: b.phone,
//             seva: b.sava_id?.name || "",
//             sevadate: b.sava_id?.date?.split("T")[0] || b.from_booking_date?.split("T")[0],
//             gotra: b.gotra,
//             nakshatra: b.nakshatra,
//             raashi: b.raashi,
//             district: b.district,
//             state: b.state,
//             address: b.address,
//             pincode: b.pincode,
//             bookeddate: b.createdAt?.split("T")[0],
//             amount: b.sava_id?.price || 0,
//             payment: b.booking_type || "N/A",
//             screenshot: b.payment_screenshot,
//             status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
//           }))
//         : [];

//       // ✅ Fetch Event bookings
//       const eventRes = await axiosEvent.get("/getBookings");
//       const eventBookings = eventRes.data.success
//         ? eventRes.data.data.map((b) => ({
//             id: b._id,
//             type: "Event",
//             name: b.karta_name,
//             mobile: b.phone,
//             seva: b.pooja?.name || "",
//             sevadate: b.pooja?.date?.split("T")[0],
//             gotra: b.gotra,
//             nakshatra: b.nakshatra,
//             raashi: b.raashi,
//             district: b.district,
//             state: b.state,
//             address: b.address,
//             pincode: b.pincode,
//             bookeddate: b.createdAt?.split("T")[0],
//             amount: b.pooja?.price || 0,
//             payment: b.payment_screenshot ? "Online" : "Cash",
//             screenshot: b.payment_screenshot,
//             status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
//           }))
//         : [];

//       // ✅ Merge
//       const allBookings = [...sevaBookings, ...eventBookings];
//       setBookings(allBookings);

//       // ✅ Unique sevas for filter
//       const uniqueSevas = [...new Set(allBookings.map((b) => b.seva).filter(Boolean))];
//       setSevas(uniqueSevas);
//     } catch (err) {
//       console.error("Error fetching bookings:", err.response?.data || err.message);
//       showToast("Error fetching bookings", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateStatus = async (id, type, newStatus) => {
//     setUpdatingId(id);
//     try {
//       const axiosClient = type === "Seva" ? axiosSeva : axiosEvent;
//       const endpoint =
//         type === "Seva"
//           ? `/updateBookingStatus/${id}`
//           : `/updateBookingStatus/${id}`;

//       const body = type === "Seva"
//         ? { status: newStatus.toLowerCase() }
//         : { bookingId: id, status: newStatus.toLowerCase() };

//       const res = await axiosClient.patch(endpoint, body);

//       if (res.data.success) {
//         setBookings((prev) =>
//           prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
//         );
//         showToast(`Booking ${newStatus} successfully!`);
//       } else {
//         showToast("Failed to update status", "error");
//       }
//     } catch (err) {
//       console.error("Error updating status:", err.response?.data || err.message);
//       showToast("Error updating status", "error");
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const resetFilters = () => {
//     setFilters({
//       type: "All",
//       seva: "All",
//       fromDate: "",
//       toDate: "",
//       status: "All",
//       mobile: "",
//     });
//     showToast("Filters reset", "info");
//   };

//   const filteredBookings = bookings.filter((b) => {
//     const afterFrom = !filters.fromDate || b.sevadate >= filters.fromDate;
//     const beforeTo = !filters.toDate || b.sevadate <= filters.toDate;
//     const matchMobile =
//       !filters.mobile ||
//       b.mobile?.toLowerCase().includes(filters.mobile.toLowerCase());

//     return (
//       (filters.type === "All" || b.type === filters.type) &&
//       (filters.seva === "All" || b.seva === filters.seva) &&
//       matchMobile &&
//       afterFrom &&
//       beforeTo &&
//       (filters.status === "All" || b.status === filters.status)
//     );
//   });

//   const totalAmount = filteredBookings.reduce((sum, b) => sum + b.amount, 0);

//   if (loading) return <div>Loading bookings...</div>;

//   return (
//     <div className="combined-bookings">
//       <h2 className="page-heading">Combined Bookings</h2>

//       {/* Filters */}
//       <div className="filters">
//         <div className="form-group">
//           <label>Type</label>
//           <select name="type" value={filters.type} onChange={handleFilterChange}>
//             <option value="All">All</option>
//             <option value="Seva">Seva</option>
//             <option value="Event">Event</option>
//           </select>
//         </div>
//         <div className="form-group">
//           <label>Seva</label>
//           <select name="seva" value={filters.seva} onChange={handleFilterChange}>
//             <option value="All">All</option>
//             {sevas.map((s, idx) => (
//               <option key={idx} value={s}>{s}</option>
//             ))}
//           </select>
//         </div>
//         <div className="form-group">
//           <label>Mobile</label>
//           <input
//             type="text"
//             name="mobile"
//             value={filters.mobile}
//             onChange={handleFilterChange}
//             placeholder="Enter mobile number"
//           />
//         </div>
//         <div className="form-group">
//           <label>From Date</label>
//           <input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange}/>
//         </div>
//         <div className="form-group">
//           <label>To Date</label>
//           <input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange}/>
//         </div>
//         <div className="form-group">
//           <label>Status</label>
//           <select name="status" value={filters.status} onChange={handleFilterChange}>
//             <option value="All">All</option>
//             <option value="Pending">Pending</option>
//             <option value="Approved">Approved</option>
//             <option value="Rejected">Rejected</option>
//           </select>
//         </div>
//         <div className="form-group filter-actions">
//           <button className="btn btn-secondary" onClick={resetFilters}>Reset</button>
//         </div>
//       </div>

//       {/* Total Amount */}
//       <div className="approve-total">
//         <span className="total-amount">Total Amount: ₹{totalAmount.toFixed(2)}</span>
//       </div>

//       {/* Table */}
//       <div className="table-container">
//         <table className="custom-table">
//           <thead>
//             <tr>
//               <th>SI NO</th>
//               <th>Type</th>
//               <th>ID</th>
//               <th>KARTA NAME</th>
//               <th>MOBILE</th>
//               <th>SEVA</th>
//               <th>SEVA-DATE</th>
//               <th>GOTRA</th>
//               <th>NAKSHATRA</th>
//               <th>RAASHI</th>
//               <th>DISTRICT</th>
//               <th>STATE</th>
//               <th>ADDRESS</th>
//               <th>PINCODE</th>
//               <th>BOOKED-DATE</th>
//               <th>AMOUNT</th>
//               <th>PAYMENT</th>
//               <th>SCREENSHOT</th>
//               <th>STATUS</th>
//               <th>ACTION</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredBookings.map((b, index) => (
//               <tr key={b.id}>
//                 <td>{index + 1}</td>
//                 <td>{b.type}</td>
//                 <td>{b.id}</td>
//                 <td>{b.name}</td>
//                 <td>{b.mobile}</td>
//                 <td>{b.seva}</td>
//                 <td>{b.sevadate}</td>
//                 <td>{b.gotra}</td>
//                 <td>{b.nakshatra}</td>
//                 <td>{b.raashi}</td>
//                 <td>{b.district}</td>
//                 <td>{b.state}</td>
//                 <td>{b.address}</td>
//                 <td>{b.pincode}</td>
//                 <td>{b.bookeddate}</td>
//                 <td>₹{b.amount.toFixed(2)}</td>
//                 <td>{b.payment}</td>
//                 <td>
//                   {b.screenshot && (
//                     <img
//                       src={b.screenshot}
//                       alt="screenshot"
//                       width="60"
//                       height="60"
//                       style={{ cursor: "pointer" }}
//                       onClick={() => setViewImage(b.screenshot)}
//                     />
//                   )}
//                 </td>
//                 <td
//                   className={
//                     b.status === "Approved"
//                       ? "status-approved"
//                       : b.status === "Rejected"
//                       ? "status-rejected"
//                       : "status-pending"
//                   }
//                 >
//                   {b.status}
//                 </td>
//                 <td>
//                   <button
//                     className="btn btn-success btn-sm"
//                     onClick={() => updateStatus(b.id, b.type, "Approved")}
//                     disabled={updatingId === b.id}
//                   >
//                     {updatingId === b.id && b.status !== "Approved"
//                       ? "Approving..."
//                       : "Approve"}
//                   </button>
//                   <button
//                     className="btn btn-danger btn-sm"
//                     onClick={() => updateStatus(b.id, b.type, "Rejected")}
//                     disabled={updatingId === b.id}
//                   >
//                     {updatingId === b.id && b.status !== "Rejected"
//                       ? "Rejecting..."
//                       : "Reject"}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Image Modal */}
//       {viewImage && (
//         <div className="image-modal" onClick={() => setViewImage(null)}>
//           <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
//             <button className="image-modal-close" onClick={() => setViewImage(null)}>✕</button>
//             <img src={viewImage} alt="Full view" />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
const DashboardStats = () => {
  const [eventStats, setEventStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [sevaStats, setSevaStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [templeCount, setTempleCount] = useState(0);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingSevas, setLoadingSevas] = useState(true);
  const [eventBookings, setEventBookings] = useState([]);
  const [sevaBookings, setSevaBookings] = useState([]);
  const API_BASE = process.env.REACT_APP_BACKEND_API;
  const token = localStorage.getItem("userToken");
  const axiosAuthEvent = axios.create({
    baseURL: `${API_BASE}api/eventbooking`,
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  const axiosAuthSeva = axios.create({
    baseURL: `${API_BASE}api/savabooking`,
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  useEffect(() => {
    fetchEventStats();
    fetchSevaStats();
    fetchTempleCount();
  }, []);
  const fetchEventStats = async () => {
    try {
      setLoadingEvents(true);
      const res = await axiosAuthEvent.get("/getBookings");
      if (res.data.success) {
        const data = res.data.data;
        setEventBookings(data);
        const pending = data.filter((b) => b.status?.toLowerCase() === "pending").length;
        const rejected = data.filter((b) => b.status?.toLowerCase() === "rejected").length;
        const approved = data.filter((b) => b.status?.toLowerCase() === "approved").length;
        setEventStats({ pending, approved, rejected });
      }
    } catch (err) {
      console.error("Error fetching event stats:", err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchSevaStats = async () => {
    try {
      setLoadingSevas(true);
      const res = await axiosAuthSeva.get("/getAll");
      if (res.data.success) {
        const data = res.data.data;
  
        // ✅ Only Online payments
        const onlineBookings = data.filter((b) => b.payment_screenshot);
  
        setSevaBookings(onlineBookings);
  
        const pending = onlineBookings.filter(
          (b) => b.status?.toLowerCase() === "pending"
        ).length;
  
        const rejected = onlineBookings.filter(
          (b) => b.status?.toLowerCase() === "rejected"
        ).length;
  
        const approved = onlineBookings.filter(
          (b) => b.status?.toLowerCase() === "approved"
        ).length;
  
        setSevaStats({ pending, approved, rejected });
      }
    } catch (err) {
      console.error("Error fetching seva stats:", err);
    } finally {
      setLoadingSevas(false);
    }
  };
  const fetchTempleCount = async () => {
    try {
      const res = await axiosAuthSeva.get("/getAll");
      if (res.data.success) {
        const approvedBookings = res.data.data.filter(
          (b) =>
            b.status?.toLowerCase() === "approved" &&
            (b.booking_type?.toLowerCase() === "upi" ||
             b.booking_type?.toLowerCase() === "offline")
        );
        setTempleCount(approvedBookings.length);
      }
    } catch (err) {
      console.error("Error fetching temple bookings:", err);
    }
  };
  
  // CSV download for Events
  const downloadEventCSV = () => {
    if (!eventBookings.length) return alert("No event bookings to export!");
    const headers = [
      "ID","Karta Name","Mobile","Seva","Seva Date","Gotra","Nakshatra",
      "Raashi","District","State","Address","Pincode","Booked Date",
      "Amount","Payment","Status","Event Name"
    ];
    const rows = eventBookings.map((b) => [
      b._id,
      b.karta_name,
      b.phone,
      b.pooja?.name || "",
      b.pooja?.date?.split("T")[0] || "",
      b.gotra,
      b.nakshatra,
      b.raashi,
      b.district,
      b.state,
      `"${b.address}"`,
      b.pincode,
      b.createdAt?.split("T")[0] || "",
      b.pooja?.price || 0,
      b.payment_screenshot ? "Online" : "Cash",
      b.status.charAt(0).toUpperCase() + b.status.slice(1),
      b.event_id?.event_name || "",
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(r => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "event_bookings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV download for Sevas
  const downloadSevaCSV = () => {
    if (!sevaBookings.length) return alert("No seva bookings to export!");
    const headers = [
      "ID","Karta Name","Mobile","Seva","Seva Date","Gotra","Nakshatra",
      "Raashi","District","State","Address","Pincode","Booked Date",
      "Amount","Payment","Status"
    ];
    const rows = sevaBookings.map((b) => [
      b._id,
      b.karta_name,
      b.phone,
      b.sava_id?.name || "",
      b.sava_id?.date?.split("T")[0] || b.from_booking_date?.split("T")[0] || "",
      b.gotra,
      b.nakshatra,
      b.raashi,
      b.district,
      b.state,
      `"${b.address}"`,
      b.pincode,
      b.createdAt?.split("T")[0] || "",
      b.sava_id?.price || 0,
      b.payment_screenshot ? "Online" : "Cash",
      b.status.charAt(0).toUpperCase() + b.status.slice(1),
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(r => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "seva_bookings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const downloadTempleCSV = async () => {
    try {
      const res = await axiosAuthSeva.get("/getAll");
      if (!res.data.success) return alert("No temple bookings to export!");
  
      const approvedBookings = res.data.data.filter(
        (b) =>
          b.status?.toLowerCase() === "approved" &&
          (b.booking_type?.toLowerCase() === "upi" ||
           b.booking_type?.toLowerCase() === "offline")
      );
  
      if (!approvedBookings.length) return alert("No temple bookings to export!");
  
      const headers = [
        "ID","Karta Name","Mobile","Seva","Seva Date","Gotra","Nakshatra",
        "Raashi","District","State","Address","Pincode","Booked Date","Amount","Payment","Status"
      ];
  
      const rows = approvedBookings.map((b) => [
        b._id,
        b.karta_name,
        b.phone,
        b.sava_id?.name || "",
        b.sava_id?.date?.split("T")[0] || b.from_booking_date?.split("T")[0] || "",
        b.gotra,
        b.nakshatra,
        b.raashi,
        b.district,
        b.state,
        `"${b.address}"`,
        b.pincode,
        b.createdAt?.split("T")[0] || "",
        b.sava_id?.price || 0,
        b.booking_type ? b.booking_type.charAt(0).toUpperCase() + b.booking_type.slice(1) : "",
        b.status.charAt(0).toUpperCase() + b.status.slice(1),
      ]);
  
      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers, ...rows].map((r) => r.join(",")).join("\n");
  
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", "temple_bookings.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading temple bookings:", err);
      alert("Something went wrong while exporting temple bookings!");
    }
  };
  return (
    <>
      <div className="stats-grid">
       <div className="stat-card">
          <h4>EVENTS</h4>
          {loadingEvents ? (
            <p>Loading...</p>
          ) : (
            <>
              <p className="pending">{eventStats.pending} Pending</p>
              <p className="approved">{eventStats.approved} Approved</p>
              <p className="rejected">{eventStats.rejected} Rejected</p>
            </>
          )}
          <Link to="/event-bookings" className="action-btn">Review Event Bookings</Link>
        </div>

        <div className="stat-card">
          <h4>SEVAS</h4>
          {loadingSevas ? (
            <p>Loading...</p>
          ) : (
            <>
              <p className="pending">{sevaStats.pending} Pending</p>
              <p className="approved">{sevaStats.approved} Approved</p>
              <p className="rejected">{sevaStats.rejected} Rejected</p>
            </>
          )}
          <Link to="/seva-bookings" className="action-btn">Review Seva Bookings</Link>
        </div>

        <div className="stat-card">
          <h4>TEMPLE BOOKINGS</h4>
          <p className="stat-value approved">{templeCount} Approved</p>
          <Link to="/temple-bookings" className="action-btn">View Booked Sevas</Link>
        </div>
      </div>

      <div className="export-csv-wrapper">
        <div className="export-csv-card">
          <p className="export-csv-text">Export your event bookings data</p>
          <button className="export-csv-btn" onClick={downloadEventCSV}>📥 Download Event CSV</button>
        </div>
        <div className="export-csv-card">
          <p className="export-csv-text">Export your seva bookings data</p>
          <button className="export-csv-btn" onClick={downloadSevaCSV}>📥 Download Seva CSV</button>
        </div>
        <div className="export-csv-card">
          <p className="export-csv-text">Export your temple bookings data</p>
          <button className="export-csv-btn" onClick={downloadTempleCSV}>📥 Download Temple CSV</button>
        </div>
      </div>
    </>
  );
};

export default DashboardStats;

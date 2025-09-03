import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Events.css";

const Events = () => {
  const [eventName, setEventName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [description, setDescription] = useState("");
  const [detailImages, setDetailImages] = useState({
    img1: null,
    img2: null,
    img3: null,
  });
  const [eventDates, setEventDates] = useState([{ id: Date.now(), date: "", sevaName: "", price: "" }]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);

  const API_BASE = process.env.REACT_APP_BACKEND_API;
  const token = localStorage.getItem("userToken");

  const axiosAuth = axios.create({
    baseURL: `${API_BASE}api/event`,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  const today = new Date().toISOString().split("T")[0];

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axiosAuth.get("/getAllEvents");
      if (res.data.success) {
        const events = res.data.events.map((ev) => ({
          id: ev._id,
          eventName: ev.event_name,
          fromDate: ev.from_event_date.split("T")[0],
          toDate: ev.to_event_date.split("T")[0],
          description: ev.description,
          previewImage: ev.preview_img,
          detailImages: {
            img1: ev.detail_img.img1,
            img2: ev.detail_img.img2,
            img3: ev.detail_img.img3,
          },
          eventDates: ev.poojas.map((p) => ({
            id: p._id,
            date: p.date.split("T")[0],
            sevaName: p.name,
            price: p.price,
          })),
        }));
        setSavedEvents(events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      showNotification("Error fetching events", "error");
    }
  };

  const getImageURL = (file) => (!file ? null : typeof file === "string" ? file : URL.createObjectURL(file));

  const handlePreviewImageChange = (e) => {
    setPreviewImage(e.target.files[0]);
  };

  const handleDetailImageChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      setDetailImages((prev) => ({ ...prev, [key]: file }));
    }
  };

  const handleEventDateChange = (id, field, value) => {
    setEventDates((prev) => prev.map((ed) => (ed.id === id ? { ...ed, [field]: value } : ed)));
  };

  const handleAddEventDate = () => {
    setEventDates((prev) => [...prev, { id: Date.now(), date: "", sevaName: "", price: "" }]);
  };

  const handleRemoveEventDate = (id) => {
    setEventDates((prev) => prev.filter((ed) => ed.id !== id));
  };

  const handleEdit = (id) => {
    const event = savedEvents.find((ev) => ev.id === id);
    if (event) {
      setEventName(event.eventName);
      setFromDate(event.fromDate);
      setToDate(event.toDate);
      setPreviewImage(event.previewImage);
      setDescription(event.description);
      setDetailImages({ ...event.detailImages });
      setEventDates(event.eventDates.map((d) => ({ ...d })));
      setEditingId(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axiosAuth.delete(`/deleteEvent/${id}`);
      if (res.data.success) {
        showNotification("Event deleted successfully!", "success");
        fetchEvents();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      showNotification("Failed to delete event", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (fromDate > toDate) {
      showNotification("From Date cannot be later than To Date", "warning");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("event_name", eventName);
      formData.append("from_event_date", fromDate);
      formData.append("to_event_date", toDate);
      formData.append("description", description);
  
      // Only append new preview image
      if (previewImage instanceof File) formData.append("preview_img", previewImage);
  
      // append new uploads
["img1", "img2", "img3"].forEach((key) => {
  const image = detailImages[key];
  if (image instanceof File) {
    formData.append(key, image);
  }
});

// send only old URLs (skip File objects)
const existingImages = {};
["img1", "img2", "img3"].forEach((key) => {
  const image = detailImages[key];
  if (typeof image === "string") {
    existingImages[key] = image;
  }
});
formData.append("existingImages", JSON.stringify(existingImages));

      
  
      // Pooja dates
      formData.append(
        "poojas",
        JSON.stringify(eventDates.map((ed) => ({
          date: ed.date,
          name: ed.sevaName,
          price: Number(ed.price),
        })))
      );
  
      let res;
      if (editingId) {
        res = await axiosAuth.put(`/updateEvent/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axiosAuth.post("/addEvent", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
  
      if (res.data.success) {
        showNotification(editingId ? "Event updated successfully!" : "Event saved successfully!", "success");
        fetchEvents();
        handleCancel();
      } else {
        showNotification("Failed to save event", "error");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      showNotification("Error saving event", "error");
    }
  };
  

  const handleCancel = () => {
    setEventName("");
    setFromDate("");
    setToDate("");
    setPreviewImage(null);
    setDescription("");
    setDetailImages({ img1: null, img2: null, img3: null });
    setEventDates([{ id: Date.now(), date: "", sevaName: "", price: "" }]);
    setEditingId(null);
  };

  return (
    <div className="events-container">
      {notification && <div className={`notification ${notification.type}`}>{notification.message}</div>}
      <h2>Events Management</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="events-form" noValidate>
        <div className="form-group">
          <label>Event Name</label>
          <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Enter event name" required />
        </div>

        <div className="form-group">
          <label>From Date</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} min={today} required />
        </div>

        <div className="form-group">
          <label>To Date</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} min={fromDate || today} required />
        </div>

        <div className="form-group">
          <label>Preview Image</label>
          <input type="file" accept="image/*" onChange={handlePreviewImageChange} />
          {previewImage && <p className="file-name">{typeof previewImage === "string" ? previewImage.split("/").pop() : previewImage.name}</p>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter event description" />
        </div>

        <div className="form-group">
          <label>Detail Images</label>
          <div className="detail-images-group">
            {["img1", "img2", "img3"].map((key, idx) => (
              <div key={key}>
                <label>Image {idx + 1}</label>
                <input type="file" accept="image/*" onChange={(e) => handleDetailImageChange(e, key)} />
                {detailImages[key] && <p className="file-name">{typeof detailImages[key] === "string" ? detailImages[key].split("/").pop() : detailImages[key].name}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Pooja Dates */}
        <div className="event-dates-section">
          <label>Pooja Dates</label>
          {eventDates.map(({ id, date, sevaName, price }) => (
            <div key={id} className="event-date-row">
              <input type="date" value={date} min={fromDate || today} max={toDate || ""} onChange={(e) => handleEventDateChange(id, "date", e.target.value)} required />
              <input type="text" placeholder="Pooja Name" value={sevaName} onChange={(e) => handleEventDateChange(id, "sevaName", e.target.value)} required />
              <input type="number" placeholder="Price (₹)" value={price} min="0" onChange={(e) => handleEventDateChange(id, "price", e.target.value)} required />
              {eventDates.length > 1 && <button type="button" className="remove-date-btn" onClick={() => handleRemoveEventDate(id)}>🗑️</button>}
            </div>
          ))}
          <button type="button" className="add-date-btn" onClick={handleAddEventDate}>Add Another Date</button>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">{editingId ? "Update Event" : "Save Event"}</button>
          <button type="button" onClick={handleCancel} className="cancel-btn">Cancel</button>
        </div>
      </form>

      {/* TABLE */}
      {savedEvents.length > 0 && (
        <div className="events-table-container">
          <h3>Saved Events</h3>
          <table className="events-table">
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Event Name</th>
                <th>Date Range</th>
                <th>Description</th>
                <th>Dates (Seva Name, Price)</th>
                <th>Preview Image</th>
                <th>Detail Images</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {savedEvents.map((ev, idx) => (
                <tr key={ev.id}>
                  <td>{idx + 1}</td>
                  <td>{ev.eventName}</td>
                  <td>{ev.fromDate} to {ev.toDate}</td>
                  <td style={{ maxWidth: "250px" }}>{ev.description.length > 100 ? ev.description.slice(0, 100) + "..." : ev.description}</td>
                  <td>{ev.eventDates.map(({ id, date, sevaName, price }) => <div key={id}>{date} ({sevaName}, ₹{price})</div>)}</td>
                  <td>{ev.previewImage && <img src={getImageURL(ev.previewImage)} alt="Preview" className="table-image" />}</td>
                  <td>{["img1", "img2", "img3"].map((key) => ev.detailImages[key] ? <img key={key} src={getImageURL(ev.detailImages[key])} alt={key} className="table-image" /> : null)}</td>
                  <td>
                    <button className="action-btn edit-btn" title="Edit" onClick={() => handleEdit(ev.id)}>Edit</button>
                    <button className="action-btn delete-btn" title="Delete" onClick={() => handleDelete(ev.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Events;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RecurringEvents.css";

const RecurringEvents = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [description, setDescription] = useState("");
  const [detailImages, setDetailImages] = useState({
    img1: null,
    img2: null,
    img3: null,
  });
  const [recurrencePattern, setRecurrencePattern] = useState("yearly");
  const [savedEvents, setSavedEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // ✅ Toast message states
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success"); // "success" | "error"

  const API_BASE = process.env.REACT_APP_BACKEND_API;
  const token = localStorage.getItem("userToken");

  const axiosAuth = axios.create({
    baseURL: `${API_BASE}api/recurring`,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // Fetch all recurring events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axiosAuth.get("/getRecurrings");
      if (res.data.success) {
        setSavedEvents(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      showMessage("Failed to fetch recurring events", "error");
    }
  };

  const handlePreviewImageChange = (e) => {
    setPreviewImage(e.target.files[0]);
  };

  const handleDetailImageChange = (e, imageKey) => {
    setDetailImages((prev) => ({ ...prev, [imageKey]: e.target.files[0] }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("recurring_event_name", eventName);
  
    // ✅ Send ISO format (YYYY-MM-DD) directly
    formData.append("recurring_from_event_date", eventDate);
    formData.append("recurring_to_event_date", eventDate);
  
    formData.append("description", description);
    formData.append("type", recurrencePattern);
  
    if (previewImage) formData.append("preview_img", previewImage);
    if (detailImages.img1) formData.append("img1", detailImages.img1);
    if (detailImages.img2) formData.append("img2", detailImages.img2);
    if (detailImages.img3) formData.append("img3", detailImages.img3);
  
    try {
      let res;
      if (editingId) {
        res = await axiosAuth.put(`/updateRecurring/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axiosAuth.post("/createRecurring", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
  
      if (res.data.success) {
        fetchEvents();
        resetForm();
        showMessage(
          editingId
            ? "Recurring event updated successfully"
            : "Recurring event added successfully",
          "success"
        );
      }
    } catch (error) {
      console.error("Error saving event:", error);
      showMessage("Failed to save recurring event", "error");
    }
  };
  
  const handleDelete = async (id) => {
    
    try {
      const res = await axiosAuth.delete(`/deleteRecurring/${id}`);
      if (res.data.success) {
        setSavedEvents(savedEvents.filter((event) => event._id !== id));
        showMessage("Recurring event deleted successfully", "success");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      showMessage("Failed to delete recurring event", "error");
    }
  };

  const handleEdit = (event) => {
    setEditingId(event._id);
    setEventName(event.recurring_event_name);
    setEventDate(event.recurring_from_event_date.split("T")[0]);
    setDescription(event.description);
    setRecurrencePattern(event.type);

    const formElement = document.getElementById("recurring-form");
  if (formElement) {
    formElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  };

  const resetForm = () => {
    setEventName("");
    setEventDate("");
    setPreviewImage(null);
    setDescription("");
    setDetailImages({ img1: null, img2: null, img3: null });
    setRecurrencePattern("yearly");
    setEditingId(null);
  };

  // ✅ Show toast-like message
  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div id="recurring-form" className="recurring-event-container">
      <h2>{editingId ? "Edit Recurring Event" : "Add Recurring Event"}</h2>

      {/* ✅ Toast message banner */}
      {message && <div className={`toast-message ${messageType}`}>{message}</div>}

      <form  className="recurring-event-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Event Date</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Preview Image</label>
          <input type="file" accept="image/*" onChange={handlePreviewImageChange} />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="form-group">
          <label>Detail Images</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleDetailImageChange(e, "img1")}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleDetailImageChange(e, "img2")}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleDetailImageChange(e, "img3")}
          />
        </div>

        <div className="form-group">
        <label>Recurrence Pattern</label>
        <input
          type="text"
          value="Yearly"
          readOnly
          className="readonly-input"
        />
      </div>


        <button type="submit" className="upload-button">
          {editingId ? "Update Event" : "Upload Event"}
        </button>
        {editingId && (
          <button type="button" className="cancel-button" onClick={resetForm}>
            Cancel Edit
          </button>
        )}
      </form>

      <div className="saved-events-list">
        {savedEvents.length === 0 && <p>No recurring events added yet.</p>}
        {savedEvents.map((event, index) => (
          <div key={event._id} className="saved-event-item">
            <div className="saved-event-header">
              <span className="item-number">{index + 1}.</span>
              <span className="item-title">{event.recurring_event_name}</span>
              <button className="edit-button" onClick={() => handleEdit(event)}>
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(event._id)}
              >
                Delete
              </button>
            </div>
            <div className="saved-event-details">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(event.recurring_from_event_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Description:</strong> {event.description}
              </p>
              <p>
                <strong>Recurrence Pattern:</strong> {event.type}
              </p>
              <div className="images-container">
                {event.preview_img && (
                  <img
                    src={event.preview_img}
                    alt="Preview"
                    className="saved-image"
                  />
                )}
                {[event.detail_img?.img1, event.detail_img?.img2, event.detail_img?.img3].map(
                  (img, i) =>
                    img ? (
                      <img
                        key={i}
                        src={img}
                        alt={`Detail ${i + 1}`}
                        className="saved-image"
                      />
                    ) : null
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecurringEvents;

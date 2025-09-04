import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddSevas.css";

const API_BASE = process.env.REACT_APP_BACKEND_API; // your backend API base
const token = localStorage.getItem("userToken");

// Axios instance with token for sevas
const axiosAuth = axios.create({
  baseURL: `${API_BASE}api/sava`,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

// Axios instance for recurring events
const axiosRecurring = axios.create({
  baseURL: `${API_BASE}api/recurring`,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

const AddSevas = () => {
  const [sevaType, setSevaType] = useState("General Sevas");
  const [sevaName, setSevaName] = useState("");
  const [description, setDescription] = useState("");
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [savedSevas, setSavedSevas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success"); // success | error
  const [filterType, setFilterType] = useState("All");

  const [recurringEvents, setRecurringEvents] = useState([]);
  const [selectedRecurringId, setSelectedRecurringId] = useState("");

  useEffect(() => {
    fetchSevas();
  }, []);

  useEffect(() => {
    if (sevaType === "Event-Specific Sevas") {
      fetchRecurringEvents();
    }
  }, [sevaType]);

  const fetchSevas = async () => {
    try {
      const res = await axiosAuth.get("/getAllSevas");
      if (res.data.success) {
        setSavedSevas(res.data.data);
      }
    } catch (err) {
      console.error(err);
      showMessage("Failed to fetch sevas", "error");
    }
  };

  const fetchRecurringEvents = async () => {
    try {
      const res = await axiosRecurring.get("/getRecurrings");
      if (res.data.success) {
        setRecurringEvents(res.data.data);
      }
    } catch (err) {
      console.error(err);
      showMessage("Failed to fetch recurring events", "error");
    }
  };

  const handleRecurringSelect = (id) => {
    setSelectedRecurringId(id);
    const selected = recurringEvents.find((ev) => ev._id === id);
    if (selected) {
      setSevaName(selected.recurring_event_name || "");
      setDate(selected.recurring_from_event_date ? selected.recurring_from_event_date.split("T")[0] : "");
      setImagePreview(null); // remove recurring event image
    } else {
      setSevaName("");
      setDate("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const resetForm = () => {
    setSevaType("General Sevas");
    setSevaName("");
    setDescription("");
    setStartDay("");
    setEndDay("");
    setDate("");
    setPrice("");
    setImage(null);
    setImagePreview(null);
    setEditingId(null);
    setSelectedRecurringId("");
  };

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", sevaName);
      formData.append("category", sevaType);
      formData.append("description", description);
      formData.append("price", price);

      if (sevaType === "General Sevas") {
        formData.append("days", `${startDay}${startDay && endDay ? " to " : ""}${endDay}`);
      } else {
        formData.append("date", date);
        formData.append("recurring_id", selectedRecurringId);
      }

      if (image) formData.append("img", image);

      let res;
      if (editingId) {
        res = await axiosAuth.put(`/updateSeva/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data.success) showMessage("Seva updated successfully");
      } else {
        res = await axiosAuth.post("/createSeva", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data.success) showMessage("Seva created successfully");
      }

      fetchSevas();
      resetForm();
    } catch (err) {
      console.error(err);
      showMessage("Failed to save seva", "error");
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await axiosAuth.get(`/getSevaById/${id}`);
      if (res.data.success) {
        const seva = res.data.data;
        setEditingId(seva._id);
        setSevaType(seva.category);
        setSevaName(seva.name);
        setDescription(seva.description);
        setPrice(seva.price);
        if (seva.category === "General Sevas") {
          const [start, end] = seva.days.split(" to ");
          setStartDay(start || "");
          setEndDay(end || "");
        } else {
          setDate(seva.date ? seva.date.split("T")[0] : "");
        }
        setImagePreview(seva.img || null);
        document.getElementById("edit")?.scrollIntoView({ behavior: "smooth" });
        
      }
    } catch (err) {
      console.error(err);
      showMessage("Failed to fetch seva details", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axiosAuth.delete(`/deleteSeva/${id}`);
      if (res.data.success) {
        showMessage("Seva deleted successfully", "success"); // ✅ your custom message
        setSavedSevas(savedSevas.filter((seva) => seva._id !== id));
      }
    } catch (err) {
      console.error(err);
      showMessage("Failed to delete seva", "error");
    }
  };
  

  return (
    <div className="general-sevas-container">
      <header className="general-sevas-header">
        <h2>{editingId ? "Edit Seva" : "Add Seva"}</h2>
        {message && <div className={`toast-message ${messageType}`}>{message}</div>}
      </header>

      <section id="edit" className="general-sevas-form-card">
        <h3>Seva Details</h3>
        <form className="general-sevas-form" onSubmit={handleSubmit}>
          {/* Seva Type */}
          <div className="form-group-seva">
            <label htmlFor="sevaType">Seva Type</label>
            <select
              id="sevaType"
              value={sevaType}
              onChange={(e) => setSevaType(e.target.value)}
              className="input-seva"
              required
            >
              <option value="General Sevas">General Sevas</option>
              <option value="Event-Specific Sevas">Event Specific Sevas</option>
            </select>
          </div>

          {/* Seva Name or Recurring Event Dropdown */}
          {sevaType === "Event-Specific Sevas" ? (
            <div className="form-group-seva">
              <label htmlFor="recurringSeva">Select Seva</label>
              <select
                id="recurringSeva"
                value={selectedRecurringId}
                onChange={(e) => handleRecurringSelect(e.target.value)}
                className="input-seva"
                required
              >
                <option value="">Select Seva</option>
                {recurringEvents.map((ev) => (
                  <option key={ev._id} value={ev._id}>
                    {ev.recurring_event_name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="form-group-seva">
              <label htmlFor="sevaName">Seva Name</label>
              <input
                type="text"
                id="sevaName"
                value={sevaName}
                onChange={(e) => setSevaName(e.target.value)}
                placeholder="Enter Seva Name"
                required
                className="input-seva"
              />
            </div>
          )}

          {/* Description */}
          <div className="form-group-seva">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Description"
              rows={4}
              required
              className="textarea-seva"
            />
          </div>

          {/* Conditional Days/Date */}
          {sevaType === "General Sevas" && (
            <>
              <div className="form-group-seva">
                <label htmlFor="startDay">Start Day</label>
                <select
                  id="startDay"
                  value={startDay}
                  onChange={(e) => setStartDay(e.target.value)}
                  className="input-seva"
                >
                  <option value="">Select Start Day</option>
                  {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="form-group-seva">
                <label htmlFor="endDay">End Day</label>
                <select
                  id="endDay"
                  value={endDay}
                  onChange={(e) => setEndDay(e.target.value)}
                  className="input-seva"
                >
                  <option value="">Select End Day</option>
                  {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {sevaType === "Event-Specific Sevas" && (
            <div className="form-group-seva">
              <label>Date</label>
              <input
                type="text"
                value={date ? new Date(date).toLocaleDateString() : ""}
                readOnly
                className="input-seva"
              />
            </div>
          )}

          {/* Price */}
          <div className="form-group-seva">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter Price"
              min="0"
              step="0.01"
              required
              className="input-seva"
            />
          </div>

          {/* Image */}
          <div className="form-group-seva">
            <label htmlFor="imageUpload">Upload Image</label>
            <input type="file" id="imageUpload" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <div className="image-preview-container-seva">
                <img src={imagePreview} alt="Seva Preview" className="image-preview-seva" />
              </div>
            )}
          </div>

          <button type="submit" className="submit-button-seva">
            {editingId ? "Update Seva" : "Submit Seva"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="cancel-button-seva">
              Cancel Edit
            </button>
          )}
        </form>
      </section>

      {/* Filter Buttons */}
      <section className="sevas-filter-buttons">
        <button className={filterType === "All" ? "active-filter" : ""} onClick={() => setFilterType("All")}>All</button>
        <button className={filterType === "General Sevas" ? "active-filter" : ""} onClick={() => setFilterType("General Sevas")}>General Sevas</button>
        <button className={filterType === "Event-Specific Sevas" ? "active-filter" : ""} onClick={() => setFilterType("Event-Specific Sevas")}>Event-Specific Sevas</button>
      </section>

      {/* Saved Sevas */}
      <section className="saved-sevas-list">
        <h3>Saved Sevas</h3>
        {savedSevas.filter(seva => filterType === "All" || seva.category === filterType).length === 0 && <p className="empty-message">No sevas added yet.</p>}
        <div className="sevas-grid">
          {savedSevas
            .filter(seva => filterType === "All" || seva.category === filterType)
            .map((seva) => (
              <div key={seva._id} className="seva-item">
                <div className="seva-item-header">
                  <h4>{seva.name}</h4>
                  <button className="delete-button-seva" onClick={() => handleDelete(seva._id)}>Delete</button>
                  <button className="edit-button-seva" onClick={() => handleEdit(seva._id)}>Edit</button>
                </div>
                {seva.img && <img src={seva.img} alt={seva.name} className="seva-image" />}
                <p><strong>Description:</strong> {seva.description}</p>
                {seva.category === "General Sevas" && seva.days && <p><strong>Days:</strong> {seva.days}</p>}
                {seva.category === "Event-Specific Sevas" && seva.date && <p><strong>Date:</strong> {new Date(seva.date).toLocaleDateString()}</p>}
                <p><strong>Price:</strong> ₹{seva.price}</p>
                <p><strong>Seva Type:</strong> {seva.category}</p>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default AddSevas;

import React, { useState } from "react";
import "./EventSpecificSevas.css";

const EventSpecificSevas = () => {
  const [sevaName, setSevaName] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [savedSevas, setSavedSevas] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveSeva = (e) => {
    e.preventDefault();
    if (!sevaName.trim() || !description.trim()) {
      alert("Please enter at least Seva Name and Description.");
      return;
    }
    const newSeva = {
      id: Date.now(),
      sevaName,
      description,
      eventDate,
      price,
      imagePreview,
    };
    setSavedSevas((prev) => [newSeva, ...prev]);
    // Clear form
    setSevaName("");
    setDescription("");
    setEventDate("");
    setPrice("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDelete = (id) => {
    setSavedSevas((prev) => prev.filter((seva) => seva.id !== id));
  };

  return (
    <div className="event-sevas-container">
      <div className="event-sevas-header">
        <h2>Event-Specific Sevas</h2>
        <p>Add sevas specific to events below.</p>
      </div>

      <div className="event-sevas-form-card">
        <h3>Add New Event-Specific Seva</h3>
        <form className="event-sevas-form" onSubmit={handleSaveSeva}>
          <div className="form-group-event">
            <label>Seva Name *</label>
            <input
              type="text"
              className="input-event"
              value={sevaName}
              onChange={(e) => setSevaName(e.target.value)}
              placeholder="Enter Seva Name"
              required
            />
          </div>

          <div className="form-group-event">
            <label>Description *</label>
            <textarea
              className="textarea-event"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              placeholder="Enter Description"
              required
            />
          </div>

          <div className="form-group-event">
            <label>Event Date (optional)</label>
            <input
              type="date"
              className="input-event"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>

          <div className="form-group-event">
            <label>Price (optional)</label>
            <input
              type="number"
              className="input-event"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter Price"
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group-event">
            <label className="file-upload-label-event">
              Upload Image (optional)
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input-event"
              />
              <div className="file-upload-button-event">Choose Image</div>
            </label>
            {imagePreview && (
              <div className="image-preview-container-event">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview-event"
                />
              </div>
            )}
          </div>

          <button type="submit" className="submit-button-event">
            Save Seva
          </button>
        </form>
      </div>

      <div className="saved-sevas-list-event">
        <h3>Saved Event-Specific Sevas</h3>
        {savedSevas.length === 0 ? (
          <p className="empty-message-event">No sevas added yet.</p>
        ) : (
          <div className="sevas-grid-event">
            {savedSevas.map((seva, index) => (
              <div key={seva.id} className="seva-item-event">
                <div className="seva-item-header-event">
                  <h4 className="seva-name-event">{seva.sevaName}</h4>
                  <button
                    className="delete-button-event"
                    onClick={() => handleDelete(seva.id)}
                  >
                    Delete
                  </button>
                </div>
                {seva.imagePreview && (
                  <img
                    src={seva.imagePreview}
                    alt={seva.sevaName}
                    className="seva-image-event"
                  />
                )}
                <p className="seva-description-event">{seva.description}</p>
                {seva.eventDate && (
                  <p>
                    <strong>Event Date:</strong> {seva.eventDate}
                  </p>
                )}
                {seva.price && (
                  <p>
                    <strong>Price:</strong> ₹{parseFloat(seva.price).toFixed(2)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventSpecificSevas;

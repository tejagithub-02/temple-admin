import React, { useState } from "react";
import "./RecurringEvents.css";

const RecurringEvents = () => {
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [description, setDescription] = useState("");
  const [detailImages, setDetailImages] = useState({ img1: null, img2: null, img3: null });
  const [recurrencePattern, setRecurrencePattern] = useState("Daily");
  const [savedEvents, setSavedEvents] = useState([]);

  const handlePreviewImageChange = (e) => {
    setPreviewImage(e.target.files[0]);
  };

  const handleDetailImageChange = (e, imageKey) => {
    setDetailImages(prev => ({ ...prev, [imageKey]: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now(),
      eventName,
      startDate,
      previewImage,
      description,
      detailImages,
      recurrencePattern,
    };
    setSavedEvents([...savedEvents, newEvent]);

    // Reset form
    setEventName("");
    setStartDate("");
    setPreviewImage(null);
    setDescription("");
    setDetailImages({ img1: null, img2: null, img3: null });
    setRecurrencePattern("Daily");
  };

  const handleDelete = (id) => {
    setSavedEvents(savedEvents.filter(event => event.id !== id));
  };

  // Preview helper function
  const renderImagePreview = (file) => {
    if (!file) return null;
    return URL.createObjectURL(file);
  };

  return (
    <div className="recurring-event-container">
      <h2>Add Recurring Event</h2>
      <form className="recurring-event-form" onSubmit={handleSubmit}>
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
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Preview Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePreviewImageChange}
          />
          {previewImage && (
            <div className="image-preview-container">
              <img
                src={renderImagePreview(previewImage)}
                alt="Preview"
                className="image-preview"
              />
            </div>
          )}
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
          <label>Detail Images Image 1</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleDetailImageChange(e, "img1")}
          />
          {detailImages.img1 && (
            <div className="image-preview-container">
              <img
                src={renderImagePreview(detailImages.img1)}
                alt="Detail Image 1"
                className="image-preview"
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Image 2</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleDetailImageChange(e, "img2")}
          />
          {detailImages.img2 && (
            <div className="image-preview-container">
              <img
                src={renderImagePreview(detailImages.img2)}
                alt="Detail Image 2"
                className="image-preview"
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Image 3</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleDetailImageChange(e, "img3")}
          />
          {detailImages.img3 && (
            <div className="image-preview-container">
              <img
                src={renderImagePreview(detailImages.img3)}
                alt="Detail Image 3"
                className="image-preview"
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Recurrence Pattern</label>
          <select
            value={recurrencePattern}
            onChange={(e) => setRecurrencePattern(e.target.value)}
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        <button type="submit" className="upload-button">
          Upload Recurring Event
        </button>
      </form>

      <div className="saved-events-list">
        {savedEvents.length === 0 && <p>No recurring events added yet.</p>}
        {savedEvents.map((event, index) => (
          <div key={event.id} className="saved-event-item">
            <div className="saved-event-header">
              <span className="item-number">{index + 1}.</span>
              <span className="item-title">{event.eventName}</span>
              <button className="delete-button" onClick={() => handleDelete(event.id)}>
                Delete
              </button>
            </div>
            <div className="saved-event-details">
              <p><strong>Start Date:</strong> {event.startDate}</p>
              <p><strong>Description:</strong> {event.description}</p>
              <p><strong>Recurrence Pattern:</strong> {event.recurrencePattern}</p>
              <div className="images-container">
                {event.previewImage && (
                  <img
                    src={renderImagePreview(event.previewImage)}
                    alt="Preview"
                    className="saved-image"
                  />
                )}
                {[event.detailImages.img1, event.detailImages.img2, event.detailImages.img3].map((img, i) =>
                  img ? (
                    <img
                      key={i}
                      src={renderImagePreview(img)}
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

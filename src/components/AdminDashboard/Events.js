import React, { useState } from "react";
import "./Events.css";

const Events = () => {
  const [eventName, setEventName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [description, setDescription] = useState("");
  const [detailImages, setDetailImages] = useState({
    image1: null,
    image2: null,
    image3: null,
  });
  const [eventDates, setEventDates] = useState([
    { id: Date.now(), date: "", sevaName: "", price: "" },
  ]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const formatDate = (date) => date.toISOString().split("T")[0];
  const today = formatDate(new Date());

  const getImageURL = (file) => {
    if (!file) return null;
    return typeof file === "string" ? file : URL.createObjectURL(file);
  };

  const handlePreviewImageChange = (e) => {
    const file = e.target.files[0];
    setPreviewImage(file);
  };

  const handleDetailImageChange = (e, imageKey) => {
    const file = e.target.files[0];
    setDetailImages((prev) => ({ ...prev, [imageKey]: file }));
  };

  const handleEventDateChange = (id, field, value) => {
    setEventDates((prev) =>
      prev.map((ed) => (ed.id === id ? { ...ed, [field]: value } : ed))
    );
  };

  const handleAddEventDate = () => {
    setEventDates((prev) => [
      ...prev,
      { id: Date.now(), date: "", sevaName: "", price: "" },
    ]);
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
      setDetailImages(event.detailImages);
      setEventDates(event.eventDates.map((d) => ({ ...d })));
      setEditingId(id);
    }
  };

  const handleDelete = (id) => {
    setSavedEvents((prev) => prev.filter((ev) => ev.id !== id));
    if (editingId === id) handleCancel();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (fromDate > toDate) {
      alert("From Date cannot be later than To Date");
      return;
    }

    if (editingId) {
      setSavedEvents((prev) =>
        prev.map((ev) =>
          ev.id === editingId
            ? {
                ...ev,
                eventName,
                fromDate,
                toDate,
                previewImage,
                description,
                detailImages,
                eventDates,
              }
            : ev
        )
      );
      setEditingId(null);
      alert("Event updated!");
    } else {
      const newEvent = {
        id: Date.now(),
        eventName,
        fromDate,
        toDate,
        previewImage,
        description,
        detailImages,
        eventDates,
      };
      setSavedEvents((prev) => [...prev, newEvent]);
      alert("Event saved!");
    }

    handleCancel();
  };

  const handleCancel = () => {
    setEventName("");
    setFromDate("");
    setToDate("");
    setPreviewImage(null);
    setDescription("");
    setDetailImages({ image1: null, image2: null, image3: null });
    setEventDates([{ id: Date.now(), date: "", sevaName: "", price: "" }]);
    setEditingId(null);
  };

  return (
    <div className="events-container">
      <h2>Events Management</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="events-form" noValidate>
        <div className="form-group">
          <label>Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Enter event name"
            required
          />
        </div>

        <div className="form-group">
          <label>From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            min={today} // block past years, months, and days
            required
          />
        </div>

        <div className="form-group">
          <label>To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate || today} // after From Date
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
            <p className="file-name">
              Selected:{" "}
              {typeof previewImage === "string"
                ? previewImage
                : previewImage.name}
            </p>
          )}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter event description"
          />
        </div>

        <div className="form-group">
          <label>Detail Images</label>
          <div className="detail-images-group">
            {["image1", "image2", "image3"].map((key, idx) => (
              <div key={key}>
                <label>Image {idx + 1}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleDetailImageChange(e, key)}
                />
                {detailImages[key] && (
                  <p className="file-name">
                    {typeof detailImages[key] === "string"
                      ? detailImages[key]
                      : detailImages[key].name}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="event-dates-section">
          <label>Pooja Dates</label>
          {eventDates.map(({ id, date, sevaName, price }) => (
            <div key={id} className="event-date-row">
              <input
                type="date"
                value={date}
                min={fromDate || today} // can't go before From Date
                max={toDate || ""} // can't go after To Date
                onChange={(e) =>
                  handleEventDateChange(id, "date", e.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="Pooja Name"
                value={sevaName}
                onChange={(e) =>
                  handleEventDateChange(id, "sevaName", e.target.value)
                }
                required
              />
              <input
                type="number"
                placeholder="Price (₹)"
                value={price}
                min="0"
                onChange={(e) =>
                  handleEventDateChange(id, "price", e.target.value)
                }
                required
              />
              {eventDates.length > 1 && (
                <button
                  type="button"
                  className="remove-date-btn"
                  onClick={() => handleRemoveEventDate(id)}
                  title="Remove this date"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="add-date-btn"
            onClick={handleAddEventDate}
          >
            Add Another Date
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            {editingId ? "Update Event" : "Save Event"}
          </button>
          <button type="button" onClick={handleCancel} className="cancel-btn">
            Cancel
          </button>
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
                  <td>
                    {ev.fromDate} to {ev.toDate}
                  </td>
                  <td style={{ maxWidth: "250px" }}>
                    {ev.description.length > 100
                      ? ev.description.slice(0, 100) + "..."
                      : ev.description}
                  </td>
                  <td>
                    {ev.eventDates.map(({ id, date, sevaName, price }) => (
                      <div key={id}>
                        {date} ({sevaName}, ₹{price})
                      </div>
                    ))}
                  </td>
                  <td>
                    {ev.previewImage && (
                      <img
                        src={getImageURL(ev.previewImage)}
                        alt="Preview"
                        className="table-image"
                      />
                    )}
                  </td>
                  <td>
                    {["image1", "image2", "image3"].map((key) =>
                      ev.detailImages[key] ? (
                        <img
                          key={key}
                          src={getImageURL(ev.detailImages[key])}
                          alt={`Detail ${key}`}
                          className="table-image"
                        />
                      ) : null
                    )}
                  </td>
                  <td>
                    <button
                      className="action-btn edit-btn"
                      title="Edit"
                      onClick={() => handleEdit(ev.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      title="Delete"
                      onClick={() => handleDelete(ev.id)}
                    >
                      Delete
                    </button>
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

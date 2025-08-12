import React, { useState } from "react";
import "./GeneralSevas.css";

const GeneralSevas = () => {
  const [sevaName, setSevaName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [savedSevas, setSavedSevas] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newSeva = {
      id: Date.now(),
      sevaName,
      description,
      date,
      price,
      imagePreview,
    };

    setSavedSevas((prev) => [newSeva, ...prev]);

    setSevaName("");
    setDescription("");
    setDate("");
    setPrice("");
    setImage(null);
    setImagePreview(null);
  };

  const handleDelete = (id) => {
    setSavedSevas((prev) => prev.filter((seva) => seva.id !== id));
  };

  return (
    <div className="general-sevas-container">
      <header className="general-sevas-header">
        <h2>Add General Seva</h2>
        <p>Fill the form below to add a new General Seva.</p>
      </header>

      <section className="general-sevas-form-card">
        <h3>Seva Details</h3>
        <form className="general-sevas-form" onSubmit={handleSubmit}>
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

          <div className="form-group-seva">
            <label htmlFor="date">Date (Optional)</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-seva"
            />
          </div>

          <div className="form-group-seva">
            <label htmlFor="price">Price (INR)</label>
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

          <div className="form-group-seva">
            <label className="file-upload-label-seva" htmlFor="imageUpload">
              Upload Image
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input-seva"
              />
              <div className="file-upload-button-seva">Choose Image</div>
            </label>

            {imagePreview && (
              <div className="image-preview-container-seva">
                <img
                  src={imagePreview}
                  alt="Seva Preview"
                  className="image-preview-seva"
                />
              </div>
            )}
          </div>

          <button type="submit" className="submit-button-seva">
            Submit Seva
          </button>
        </form>
      </section>

      {/* Display saved sevas */}
      <section className="saved-sevas-list">
        <h3>Saved General Sevas</h3>
        {savedSevas.length === 0 && (
          <p className="empty-message">No sevas added yet.</p>
        )}

        <div className="sevas-grid">
          {savedSevas.map((seva) => (
            <div key={seva.id} className="seva-item">
              <div className="seva-item-header">
                <h4 className="seva-name">{seva.sevaName}</h4>
                <button
                  className="delete-button-seva"
                  onClick={() => handleDelete(seva.id)}
                >
                  Delete
                </button>
              </div>

              {seva.imagePreview && (
                <img
                  src={seva.imagePreview}
                  alt={seva.sevaName}
                  className="seva-image"
                />
              )}

              <p className="seva-description">{seva.description}</p>
              {seva.date && <p><strong>Date:</strong> {seva.date}</p>}
              <p><strong>Price:</strong> ₹{seva.price}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GeneralSevas;

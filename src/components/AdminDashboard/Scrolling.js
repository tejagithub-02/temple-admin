import React, { useState } from "react";
import "./Gallery.css"; // Reuse your existing styles

const Scrolling = () => {
  const [scrollText, setScrollText] = useState("");
  const [currentText, setCurrentText] = useState(null);

  const handleAddText = (e) => {
    e.preventDefault();
    if (!scrollText.trim()) {
      alert("Please enter some text");
      return;
    }
    // Replace any existing text with the new one
    setCurrentText({
      id: Date.now(),
      text: scrollText.trim(),
    });
    setScrollText("");
  };

  const handleDelete = () => {
    setCurrentText(null);
  };

  return (
    <div className="gallery-admin-container">
      <div className="gallery-admin-header">
        <h2>Scrolling Management</h2>
      
      </div>

      <div className="gallery-admin-content">
        {/* Upload Section */}
        <div className="gallery-upload-card">
          <h3>Add / Replace Scrolling Text</h3>
          <form onSubmit={handleAddText} className="gallery-upload-form">
            <div className="form-group">
              <label>Text Message</label>
              <input
                type="text"
                value={scrollText}
                onChange={(e) => setScrollText(e.target.value)}
                placeholder="Enter scrolling text"
                required
              />
            </div>

            <button type="submit" className="upload-button">
              Save Text
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="gallery-list-card">
          <h3>Current Scrolling Text</h3>
          {!currentText ? (
            <div className="empty-gallery">
              <p>No scrolling text set yet</p>
            </div>
          ) : (
            <div className="gallery-item">
              <div className="gallery-item-header">
                <span className="item-number">Active</span>
                <span className="item-title">{currentText.text}</span>
              </div>
              <button onClick={handleDelete} className="delete-button">
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scrolling;

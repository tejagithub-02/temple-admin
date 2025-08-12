import React, { useState } from "react";
import "./Gallery.css";

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
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

  const handleAddGalleryItem = (e) => {
    e.preventDefault();
    if (!imagePreview || !title.trim()) {
      alert("Please add both a title and image");
      return;
    }
    setGalleryItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: title.trim(),
        image: imagePreview,
      },
    ]);
    setImagePreview(null);
    setTitle("");
    e.target.reset();
  };

  const handleDelete = (id) => {
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="gallery-admin-container">
      <div className="gallery-admin-header">
        <h2>Gallery Management</h2>
        <p>Upload and manage gallery images with titles</p>
      </div>

      <div className="gallery-admin-content">
        <div className="gallery-upload-card">
          <h3>Add New Gallery Item</h3>
          <form onSubmit={handleAddGalleryItem} className="gallery-upload-form">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter image title"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="file-upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                <span className="file-upload-button">Choose Image</span>
                {imagePreview ? "Image selected" : "No image chosen"}
              </label>
            </div>
            
            {imagePreview && (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Preview" className="image-preview" />
              </div>
            )}
            
            <button type="submit" className="upload-button">
              Add to Gallery
            </button>
          </form>
        </div>

        <div className="gallery-list-card">
          <h3>Current Gallery Items</h3>
          {galleryItems.length === 0 ? (
            <div className="empty-gallery">
              <p>No gallery items have been added yet</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {galleryItems.map((item, index) => (
                <div key={item.id} className="gallery-item">
                  <div className="gallery-item-header">
                    <span className="item-number">Item {index + 1}</span>
                    <span className="item-title">{item.title}</span>
                  </div>
                  <img src={item.image} alt={item.title} className="gallery-image" />
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="delete-button"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
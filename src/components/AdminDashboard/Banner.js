import React, { useState } from "react";
import "./Banner.css";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleAddBanner = (e) => {
    e.preventDefault();
    if (!imagePreview) {
      alert("Please select an image");
      return;
    }
    setBanners((prev) => [
      ...prev,
      {
        id: Date.now(),
        image: imagePreview,
      },
    ]);
    setImagePreview(null);
    e.target.reset();
  };

  const handleDelete = (id) => {
    setBanners((prev) => prev.filter((banner) => banner.id !== id));
  };

  return (
    <div className="banner-admin-container">
      <div className="banner-admin-header">
        <h2>Banner Management</h2>
        <p>Upload and manage homepage banners</p>
      </div>

      <div className="banner-admin-content">
        <div className="banner-upload-card">
          <h3>Upload New Banner</h3>
          <form onSubmit={handleAddBanner} className="banner-upload-form">
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
              Upload Banner
            </button>
          </form>
        </div>

        <div className="banner-list-card">
          <h3>Current Banners</h3>
          {banners.length === 0 ? (
            <div className="empty-banners">
              <p>No banners have been added yet</p>
            </div>
          ) : (
            <div className="banner-grid">
              {banners.map((banner, index) => (
                <div key={banner.id} className="banner-item">
                  <div className="banner-number">Banner {index + 1}</div>
                  <img src={banner.image} alt={`Banner ${index + 1}`} className="banner-image" />
                  <button
                    onClick={() => handleDelete(banner.id)}
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

export default Banner;
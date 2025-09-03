import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Banner.css";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [notification, setNotification] = useState(null); 

  const API_BASE = process.env.REACT_APP_BACKEND_API;
  const token = localStorage.getItem("userToken");


const axiosAuth = axios.create({
  baseURL: `${API_BASE}api/banner`,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  },
});

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axiosAuth.get("/getBanners");
        if (res.data.success && res.data.data) setBanners(res.data.data);
      } catch (err) {
        console.error(err);
        showNotification("Error fetching banners", "error");
      }
    };
    fetchBanners();
  }, []);

  // Image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  // Upload banner
  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      showNotification("Please select an image", "error");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const res = await axiosAuth.post("/addBanner", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.status && res.data.data) {
        setBanners((prev) => [...prev, res.data.data]);
        setImageFile(null);
        setImagePreview(null);
        e.target.reset();
        showNotification(res.data.message || "Banner uploaded successfully");
      } else {
        showNotification(res.data.message || "Failed to upload banner", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.message || "Error uploading banner", "error");
    }
  };

  // Delete banner
  const handleDelete = async (id) => {
    try {
      const res = await axiosAuth.delete(`/deleteBanner/${id}`);
      if (res.data.success) {
        setBanners((prev) => prev.filter((banner) => banner._id !== id));
        showNotification("Banner removed successfully");
      } else {
        showNotification(res.data.message || "Failed to delete banner", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error deleting banner", "error");
    }
  };

  return (
    <div className="banner-admin-container">
      {notification && (
        <div className={`banner-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

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

            <button type="submit" className="upload-button">Upload Banner</button>
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
                <div key={banner._id} className="banner-item">
                  <div className="banner-number">Banner {index + 1}</div>
                  <img src={banner.banner_img} alt={`Banner ${index + 1}`} className="banner-image" />
                  <button onClick={() => handleDelete(banner._id)} className="delete-button">
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

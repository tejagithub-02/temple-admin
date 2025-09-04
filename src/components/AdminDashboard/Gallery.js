import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Gallery.css";


const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [message, setMessage] = useState(null); // ✅ Message state
  const [messageType, setMessageType] = useState("success"); // success or error


  const API_BASE = process.env.REACT_APP_BACKEND_API;
  const token = localStorage.getItem("userToken");

  const axiosAuth = axios.create({
    baseURL: `${API_BASE}api/gallary`,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await axiosAuth.get("/all");
      if (res.data.status) {
        setGalleryItems(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching gallery:", err);
      showMessage("Failed to fetch gallery items", "error");
    }
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || (!file && !editingItem)) {
      showMessage("Please provide both title and image", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    if (file) formData.append("file", file);

    try {
      let res;
      if (editingItem) {
        res = await axiosAuth.put(`/edit/${editingItem._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data.status) {
          showMessage("Gallery item updated successfully", "success");
          fetchGallery();
          resetForm();
        }
      } else {
        res = await axiosAuth.post("/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data.status) {
          showMessage("Gallery item added successfully", "success");
          fetchGallery();
          resetForm();
        }
      }
    } catch (err) {
      console.error("Error saving gallery:", err);
      showMessage("Failed to save gallery item", "error");
    }
  };

  const handleDelete = async (id) => {
   
    try {
      const res = await axiosAuth.delete(`/delete/${id}`);
      if (res.data.status) {
        showMessage("Gallery item deleted successfully", "success");
        fetchGallery();
      }
    } catch (err) {
      console.error("Error deleting gallery:", err);
      showMessage("Failed to delete gallery item", "error");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setTitle(item.title);
    setImagePreview(item.img);
    document.getElementById("edit-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const resetForm = () => {
    setTitle("");
    setFile(null);
    setImagePreview(null);
    setEditingItem(null);
  };


  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000); // hide after 3s
  };

  return (
    <div className="gallery-admin-container" id="edit-form">
      <div className="gallery-admin-header">
        <h2>Gallery Management</h2>
        <p>Upload and manage gallery images with titles</p>
      </div>

      {/* ✅ Message Banner */}
      {message && (
        <div className={`toast-message ${messageType}`}>
          {message}
        </div>
      )}

      <div className="gallery-admin-content">
        {/* Upload/Edit Form */}
        <div className="gallery-upload-card">
          <h3>{editingItem ? "Edit Gallery Item" : "Add New Gallery Item"}</h3>
          <form onSubmit={handleSubmit} className="gallery-upload-form">
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
                  required={!editingItem}
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
              {editingItem ? "Update Item" : "Add to Gallery"}
            </button>
            {editingItem && (
              <button type="button" className="cancel-button" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* Gallery List */}
        <div className="gallery-list-card">
          <h3>Current Gallery Items</h3>
          {galleryItems.length === 0 ? (
            <div className="empty-gallery">
              <p>No gallery items have been added yet</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {galleryItems.map((item, index) => (
                <div key={item._id} className="gallery-item">
                  <div className="gallery-item-header">
                    <span className="item-number">Item {index + 1}</span>
                    <span className="item-title">{item.title}</span>
                  </div>
                  <img src={item.img} alt={item.title} className="gallery-image" />
                  <div className="gallery-actions">
                    <button onClick={() => handleEdit(item)} className="edit-button">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="delete-button"
                    >
                      Remove
                    </button>
                  </div>
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

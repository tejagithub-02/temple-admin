import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Scrolling.css";

const Scrolling = () => {
  const [scrollText, setScrollText] = useState("");
  const [currentText, setCurrentText] = useState(null);
  const [notification, setNotification] = useState(null);

  const API_BASE = process.env.REACT_APP_BACKEND_API;
  const token = localStorage.getItem("userToken");

  const axiosAuth = axios.create({
    baseURL: `${API_BASE}api/scrolling`,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchScrolling = async () => {
      try {
        const res = await axiosAuth.get(`/getScrollings`);
        if (res.data.status && res.data.data && res.data.data.length > 0) {
          setCurrentText({
            id: res.data.data[0]._id,
            text: res.data.data[0].scrolling_content,
          });
        }
      } catch (err) {
        console.error("Error fetching scrolling text:", err);
        showNotification("Error fetching scrolling text", "error");
      }
    };
    fetchScrolling();
  }, []);

  const handleAddText = async (e) => {
    e.preventDefault();
    if (!scrollText.trim()) return showNotification("Please enter some text", "error");
    if (currentText) return showNotification("Scrolling text already exists", "error");

    try {
      const res = await axiosAuth.post(`/addScrolling`, {
        scrolling_content: scrollText.trim(),
      });
      if (res.data.status) {
        setCurrentText({
          id: res.data.data._id,
          text: res.data.data.scrolling_content,
        });
        setScrollText("");
        showNotification("Scrolling text added successfully");
      } else {
        showNotification("Failed to save text", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error adding scrolling text", "error");
    }
  };

  const handleDelete = async () => {
    if (!currentText) return;
    try {
      const res = await axiosAuth.delete(`/deleteScrolling/${currentText.id}`);
      if (res.data.status) {
        setCurrentText(null);
        setScrollText("");
        showNotification("Scrolling text removed successfully");
      } else {
        showNotification(res.data.message || "Failed to delete text", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error deleting scrolling text", "error");
    }
  };

  return (
    <div className="scrolling-admin-container">
      {notification && (
        <div className={`scrolling-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="scrolling-admin-header">
        <h2>Scrolling Management</h2>
      </div>

      <div className="scrolling-admin-content">
        <div className="scrolling-upload-card">
          <h3>Add Scrolling Text</h3>
          <form onSubmit={handleAddText} className="scrolling-upload-form">
            <div className="scrolling-form-group">
              <label>Text Message</label>
              <input
                type="text"
                value={scrollText}
                onChange={(e) => setScrollText(e.target.value)}
                placeholder={currentText ? "Text already saved" : "Enter scrolling text"}
                disabled={!!currentText}
                required
              />
            </div>
            <button
              type="submit"
              className="scrolling-upload-button"
              disabled={!!currentText}
            >
              Save Text
            </button>
          </form>
        </div>

        <div className="scrolling-list-card">
          <h3>Current Scrolling Text</h3>
          {!currentText ? (
            <div className="scrolling-empty">
              <p>No scrolling text set yet</p>
            </div>
          ) : (
            <div className="scrolling-item">
              <div className="scrolling-item-header">
                <span className="scrolling-item-number">Active</span>
                <button onClick={handleDelete} className="scrolling-delete-button">
                  Remove
                </button>
              </div>
              <div className="scrolling-item-title">{currentText.text}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scrolling;

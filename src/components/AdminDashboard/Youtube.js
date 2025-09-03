import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Youtube.css";

const API_BASE = process.env.REACT_APP_BACKEND_API;

const Youtube = () => {
  const [videoLink, setVideoLink] = useState("");
  const [videos, setVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("userToken");

  const axiosAuth = axios.create({
    baseURL: `${API_BASE}api/youtube`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // ✅ Fetch videos
  const fetchVideos = async () => {
    try {
      const res = await axiosAuth.get("/getAllYouTubes");
      if (res.data.success) {
        setVideos(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
      alert("Failed to fetch videos.");
    }
  };

  // ✅ Add / Update video
  const handleSaveVideo = async (e) => {
    e.preventDefault();
    if (!videoLink.trim()) {
      alert("Please enter a valid YouTube link");
      return;
    }

    setLoading(true);
    try {
      if (editingVideo) {
        const res = await axiosAuth.put(`/updateYouTube/${editingVideo._id}`, {
          you_tube_link: videoLink,
        });

        if (res.data.success) {
          alert("Video updated successfully!");
          setEditingVideo(null);
          setVideoLink("");
          fetchVideos();
        }
      } else {
        const res = await axiosAuth.post("/addYouTube", {
          you_tube_link: videoLink,
        });

        if (res.data.success) {
          alert("Video added successfully!");
          setVideoLink("");
          fetchVideos();
        }
      }
    } catch (err) {
      console.error("Error saving video:", err);
      alert("Failed to save video.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete video
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      const res = await axiosAuth.delete(`/deleteYouTube/${id}`, {
        data: { _id: id },
      });

      if (res.data.success) {
        alert("Video deleted successfully!");
        fetchVideos();
      }
    } catch (err) {
      console.error("Error deleting video:", err);
      alert("Failed to delete video.");
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleInputChange = (e) => {
    setVideoLink(e.target.value);
  };

  // Extract video ID for embedding
  const extractVideoId = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // ✅ Disable input if one video exists and not editing
  const isDisabled = videos.length > 0 && !editingVideo;

  return (
    <div className="video-admin-container">
      <div className="video-admin-header">
        <h2>YouTube Video Management</h2>
      </div>

      <div className="video-admin-content">
        {/* Upload Section */}
        <div className={`video-upload-card ${isDisabled ? "disabled-card" : ""}`}>
          <h3>{editingVideo ? "Update YouTube Video" : "Add YouTube Video"}</h3>
          <form onSubmit={handleSaveVideo} className="video-upload-form">
            <div className="video-form-group">
              <label>Enter YouTube Link</label>
              <input
                type="text"
                value={videoLink}
                onChange={handleInputChange}
                placeholder="https://www.youtube.com/watch?v=xxxx"
                required
                disabled={isDisabled}
              />
            </div>

            <button
              type="submit"
              className="video-upload-button"
              disabled={loading || isDisabled}
            >
              {loading ? "Saving..." : editingVideo ? "Update Video" : "Save Video"}
            </button>

            {editingVideo && (
              <button
                type="button"
                className="video-cancel-button"
                onClick={() => {
                  setEditingVideo(null);
                  setVideoLink("");
                }}
              >
                Cancel
              </button>
            )}
          </form>

          {isDisabled && (
            <p className="disabled-message">
              Only one active video is allowed. Please delete the existing one to
              add a new video.
            </p>
          )}
        </div>

        {/* Current Video Section */}
        <div className="video-list-card">
          <h3>Current Video</h3>
          {videos.length === 0 ? (
            <div className="video-empty">
              <p>No videos available</p>
            </div>
          ) : (
            videos.map((video) => {
              const videoId = extractVideoId(video.you_tube_link);
              return (
                <div key={video._id} className="video-item">
                  <div className="video-item-header">
                    <span className="video-status">Active</span>
                    <span className="video-title">
                      {video.you_tube_link.length > 40
                        ? video.you_tube_link.substring(0, 40) + "..."
                        : video.you_tube_link}
                    </span>
                  </div>

                  <div className="video-preview">
                    <iframe
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>

                  <div className="video-actions">
                    <button
                      onClick={() => {
                        setEditingVideo(video);
                        setVideoLink(video.you_tube_link);
                      }}
                      className="btn edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="btn delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Youtube;

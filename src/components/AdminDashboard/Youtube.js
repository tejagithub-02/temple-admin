import React, { useState } from "react";
import "./Gallery.css"; // Reuse your existing styles

const Youtube = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
    } else {
      alert("Please select a valid video file (MP4, WEBM, etc.)");
      e.target.value = null; // Reset input
    }
  };

  const handleUploadVideo = (e) => {
    e.preventDefault();
    if (!videoFile) {
      alert("Please choose a video file first");
      return;
    }

    const videoURL = URL.createObjectURL(videoFile);

    // Replace any existing video with the new one
    setCurrentVideo({
      id: Date.now(),
      url: videoURL,
      name: videoFile.name,
    });

    setVideoFile(null);
    e.target.reset(); // Reset form
  };

  const handleDelete = () => {
    setCurrentVideo(null);
  };

  return (
    <div className="gallery-admin-container">
      <div className="gallery-admin-header">
        <h2>Video Management</h2>
        <p>Upload one video — the previous video will be replaced.</p>
      </div>

      <div className="gallery-admin-content">
        {/* Upload Section */}
        <div className="gallery-upload-card">
          <h3>Add / Replace Video</h3>
          <form onSubmit={handleUploadVideo} className="gallery-upload-form">
            <div className="form-group">
              <label>Choose Video File</label>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                required
              />
            </div>

            <button type="submit" className="upload-button">
              Save Video
            </button>
          </form>
        </div>

        {/* Current Video Section */}
        <div className="gallery-list-card">
          <h3>Current Video</h3>
          {!currentVideo ? (
            <div className="empty-gallery">
              <p>No video uploaded yet</p>
            </div>
          ) : (
            <div className="gallery-item">
              <div className="gallery-item-header">
                <span className="item-number">Active</span>
                <span className="item-title">
                  {currentVideo.name.length > 30
                    ? currentVideo.name.substring(0, 30) + "..."
                    : currentVideo.name}
                </span>
              </div>

              {/* Video Preview */}
              <video
                src={currentVideo.url}
                controls
                width="100%"
                style={{ borderRadius: "4px" }}
              ></video>

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

export default Youtube;

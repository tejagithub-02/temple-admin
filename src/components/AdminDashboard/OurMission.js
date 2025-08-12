import React, { useState } from "react";
import "./OurMission.css";

const OurMission = () => {
  const [missionText, setMissionText] = useState("");
  const [currentMission, setCurrentMission] = useState(null);

  const handleAddMission = (e) => {
    e.preventDefault();
    if (!missionText.trim()) {
      alert("Please enter some text");
      return;
    }
    setCurrentMission({
      id: Date.now(),
      text: missionText.trim(),
    });
    setMissionText("");
  };

  const handleDelete = () => {
    setCurrentMission(null);
  };

  return (
    <div className="ourmission-container">
      <div className="ourmission-header">
        <h2>Our Mission Management</h2>
      </div>

      <div className="ourmission-content">
        {/* Add / Replace Mission Text */}
        <div className="ourmission-upload-card">
          <h3>Add / Replace Our Mission Text</h3>
          <form onSubmit={handleAddMission} className="ourmission-upload-form">
            <div className="ourmission-form-group">
              <label>Mission Text</label>
              <textarea
                rows={8}
                value={missionText}
                onChange={(e) => setMissionText(e.target.value)}
                placeholder="Enter mission statement"
                required
                className="ourmission-textarea"
              />
            </div>

            <button type="submit" className="ourmission-save-button">
              Save Mission
            </button>
          </form>
        </div>

        {/* Display Current Mission Text */}
        <div className="ourmission-list-card">
          <h3>Current Mission Text</h3>
          {!currentMission ? (
            <div className="ourmission-empty">
              <p>No mission statement set yet</p>
            </div>
          ) : (
            <div className="ourmission-item">
              <div className="ourmission-item-header">
                <span className="ourmission-item-status">Active</span>
              </div>
              <div className="ourmission-item-text">
                {currentMission.text.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <button onClick={handleDelete} className="ourmission-delete-button">
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OurMission;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AboutUs.css";

const AboutUs = () => {
  const [selectedType, setSelectedType] = useState("mission");

  // ---------------- Toast ----------------
  const [toast, setToast] = useState({ message: "", type: "" });
  const showMessage = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  // ---------------- Missions ----------------
  const [missionText, setMissionText] = useState("");
  const [missions, setMissions] = useState([]);
  const [editingMission, setEditingMission] = useState(null);
  const [deleteMissionId, setDeleteMissionId] = useState(null);

  // ---------------- Activities ----------------
  const [activities, setActivities] = useState([]);
  const [activityTitle, setActivityTitle] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [activityImage, setActivityImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [deleteActivityId, setDeleteActivityId] = useState(null);


  const API_BASE = `${process.env.REACT_APP_BACKEND_API}api`;

const token = localStorage.getItem("userToken");

const axiosAuth = axios.create({
  baseURL: API_BASE,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});



  // ---------------- Fetch Missions ----------------
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const res = await axiosAuth.get("/ourmission/getMissions");
        if (res.data.success) setMissions(res.data.data);
      } catch (err) {
        console.error("Error fetching missions:", err.response?.data || err.message);
      }
    };
    fetchMissions();
  }, []);

  // ---------------- Fetch Activities ----------------
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axiosAuth.get("/ouractivity/getAllActivities");
        if (res.data.success) setActivities(res.data.data);
      } catch (err) {
        console.error("Error fetching activities:", err.response?.data || err.message);
      }
    };
    fetchActivities();
  }, []);

  // ---------------- Missions Handlers ----------------
  const handleAddMission = async (e) => {
    e.preventDefault();
    if (!missionText.trim()) return showMessage("Please enter some text", "error");

    try {
      const res = await axiosAuth.post("/ourmission/addMission", {
        description: missionText.trim(),
      });
      if (res.data.success) {
        setMissions((prev) => [res.data.data, ...prev]);
        setMissionText("");
        showMessage(res.data.message, "success");
      }
    } catch (err) {
      console.error("Error adding mission:", err.response?.data || err.message);
      showMessage("Failed to add mission", "error");
    }
  };

  const handleUpdateMission = async (e) => {
    e.preventDefault();
    if (!missionText.trim() || !editingMission) return;

    try {
      const res = await axiosAuth.put(`/ourmission/updateMission/${editingMission._id}`, {
        description: missionText.trim(),
      });
      if (res.data.success) {
        setMissions((prev) =>
          prev.map((m) => (m._id === editingMission._id ? { ...m, description: missionText } : m))
        );
        setMissionText("");
        setEditingMission(null);
        showMessage("Mission updated successfully", "success");
      }
    } catch (err) {
      console.error("Error updating mission:", err.response?.data || err.message);
      showMessage("Failed to update mission", "error");
    }
  };

  const handleDeleteMission = async (id) => {
    try {
      const res = await axiosAuth.delete(`/ourmission/deleteMission/${id}`);
      if (res.data.success) {
        setMissions((prev) => prev.filter((m) => m._id !== id));
        setDeleteMissionId(null);
        showMessage(res.data.message, "success");
      }
    } catch (err) {
      console.error("Error deleting mission:", err.response?.data || err.message);
      showMessage("Failed to delete mission", "error");
    }
  };

  // ---------------- Activities Handlers ----------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setActivityImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const resetActivityForm = () => {
    setEditingActivity(null);
    setActivityTitle("");
    setActivityDescription("");
    setActivityImage(null);
    setPreviewImage(null);
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!activityTitle.trim() || !activityDescription.trim())
      return showMessage("Please enter title and description", "error");

    try {
      const formData = new FormData();
      formData.append("title", activityTitle.trim());
      formData.append("description", activityDescription.trim());
      if (activityImage) formData.append("file", activityImage);

      const res = await axiosAuth.post("/ouractivity/addActivity", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setActivities((prev) => [res.data.data, ...prev]);
        resetActivityForm();
        showMessage(res.data.message, "success");
      }
    } catch (err) {
      console.error("Error adding activity:", err.response?.data || err.message);
      showMessage("Failed to add activity", "error");
    }
  };

  const handleUpdateActivity = async (e) => {
    e.preventDefault();
    if (!editingActivity) return;

    try {
      const formData = new FormData();
      formData.append("title", activityTitle.trim());
      formData.append("description", activityDescription.trim());
      if (activityImage) formData.append("file", activityImage);

      const res = await axiosAuth.put(`/ouractivity/updateActivity/${editingActivity._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setActivities((prev) =>
          prev.map((a) => (a._id === editingActivity._id ? res.data.data : a))
        );
        resetActivityForm();
        showMessage("Activity updated successfully", "success");
      }
    } catch (err) {
      console.error("Error updating activity:", err.response?.data || err.message);
      showMessage("Failed to update activity", "error");
    }
  };

  const handleDeleteActivity = async (id) => {
    try {
      const res = await axiosAuth.delete(`/ouractivity/deleteActivity/${id}`);
      if (res.data.success) {
        setActivities((prev) => prev.filter((a) => a._id !== id));
        setDeleteActivityId(null);
        showMessage(res.data.message, "success");
      }
    } catch (err) {
      console.error("Error deleting activity:", err.response?.data || err.message);
      showMessage("Failed to delete activity", "error");
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="aboutus-page">
      {/* Toast */}
      {toast.message && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      {/* Header */}
      <div className="aboutus-header">
        <label>Select Type:</label>
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="mission">Our Mission</option>
          <option value="activities">Our Activities</option>
        </select>
      </div>

      {/* Missions */}
      {selectedType === "mission" && (
        <div className="aboutus-content">
          <div className="aboutus-card">
            <h3>{editingMission ? "Edit Mission" : "Add New Mission"}</h3>
            <form onSubmit={editingMission ? handleUpdateMission : handleAddMission}>
              <textarea
                rows={6}
                value={missionText}
                onChange={(e) => setMissionText(e.target.value)}
                placeholder="Enter mission statement..."
                disabled={!editingMission && missions.length > 0}
              />
              <button type="submit" disabled={!editingMission && missions.length > 0}>
                {editingMission ? "Update Mission" : "Save Mission"}
              </button>
              {editingMission && (
                <button type="button" onClick={() => { setEditingMission(null); setMissionText(""); }}>
                  Cancel
                </button>
              )}
            </form>
          </div>

          <div className="aboutus-card">
            <h3>Current Missions</h3>
            {missions.length === 0 ? (
              <p className="empty-text">No mission statement set yet</p>
            ) : (
              missions.map((mission) => (
                <div key={mission._id} className="mission-item">
                  <p>{mission.description}</p>
                  <div className="mission-actions">
                    <button
                      className="edit-btn"
                      onClick={() => { setEditingMission(mission); setMissionText(mission.description); }}
                    >
                      Edit
                    </button>

                    {deleteMissionId === mission._id ? (
                      <>
                        <button className="confirm-yes" onClick={() => handleDeleteMission(mission._id)}>Yes</button>
                        <button className="confirm-no" onClick={() => setDeleteMissionId(null)}>No</button>
                      </>
                    ) : (
                      <button className="delete-btn" onClick={() => setDeleteMissionId(mission._id)}>Remove</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Activities */}
      {selectedType === "activities" && (
        <div className="aboutus-content">
          <div className="aboutus-card">
            <h3>{editingActivity ? "Edit Activity" : "Add New Activity"}</h3>
            <form onSubmit={editingActivity ? handleUpdateActivity : handleAddActivity}>
              <input type="text" placeholder="Enter title..." value={activityTitle} onChange={(e) => setActivityTitle(e.target.value)} />
              <textarea rows={4} placeholder="Enter description..." value={activityDescription} onChange={(e) => setActivityDescription(e.target.value)} />
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {previewImage && <div className="preview-box"><img src={previewImage} alt="Preview" height="100" /></div>}
              <button type="submit">{editingActivity ? "Update Activity" : "Save Activity"}</button>
              {editingActivity && (
                <button type="button" onClick={resetActivityForm}>Cancel</button>
              )}
            </form>
          </div>

          <div className="aboutus-card">
            <h3>Current Activities</h3>
            {activities.length === 0 ? (
              <p className="empty-text">No activities added yet</p>
            ) : (
              activities.map((activity) => (
                <div key={activity._id} className="activity-item">
                  <div style={{ flex: 1 }}>
                    <h4>{activity.title}</h4>
                    <p>{activity.description}</p>
                  </div>
                  {activity.img && <img src={activity.img} alt={activity.title} className="activity-image" />}
                  <div className="activity-actions">
                    <button className="edit-btn" onClick={() => {
                      setEditingActivity(activity);
                      setActivityTitle(activity.title);
                      setActivityDescription(activity.description);
                      setActivityImage(null);
                      setPreviewImage(activity.img || null);
                    }}>Edit</button>

                    {deleteActivityId === activity._id ? (
                      <>
                        <button className="confirm-yes" onClick={() => handleDeleteActivity(activity._id)}>Yes</button>
                        <button className="confirm-no" onClick={() => setDeleteActivityId(null)}>No</button>
                      </>
                    ) : (
                      <button className="delete-btn" onClick={() => setDeleteActivityId(activity._id)}>Remove</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUs;

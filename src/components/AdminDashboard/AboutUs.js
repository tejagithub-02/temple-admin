import React, { useState } from "react";
import "./AboutUs.css"; // new styles

const AboutUs = () => {
  const [selectedType, setSelectedType] = useState("mission");

  // Mission states
  const [missionText, setMissionText] = useState("");
  const [currentMission, setCurrentMission] = useState(null);

  // Activities states
  const [activities, setActivities] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleAddMission = (e) => {
    e.preventDefault();
    if (!missionText.trim()) {
      alert("Please enter some text");
      return;
    }
    setCurrentMission({ id: Date.now(), text: missionText.trim() });
    setMissionText("");
  };

  const handleDeleteMission = () => {
    setCurrentMission(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please enter title and description");
      return;
    }
    const newActivity = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      image: imagePreview,
    };
    setActivities([newActivity, ...activities]);
    setTitle("");
    setDescription("");
    setImage(null);
    setImagePreview(null);
    e.target.reset();
  };

  const handleDeleteActivity = (id) => {
    setActivities(activities.filter((act) => act.id !== id));
  };

  return (
    <div className="aboutus-page">
      <div className="aboutus-header">
        <label>Select Type:</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="mission">Our Mission</option>
          <option value="activities">Our Activities</option>
        </select>
      </div>

      {selectedType === "mission" && (
        <div className="aboutus-content">
          <div className="aboutus-card">
            <h3>Add / Replace Our Mission</h3>
            <form onSubmit={handleAddMission}>
              <textarea
                rows={6}
                value={missionText}
                onChange={(e) => setMissionText(e.target.value)}
                placeholder="Enter mission statement..."
              />
              <button type="submit">Save Mission</button>
            </form>
          </div>

          <div className="aboutus-card">
            <h3>Current Mission</h3>
            {!currentMission ? (
              <p className="empty-text">No mission statement set yet</p>
            ) : (
              <div className="mission-item">
                <p>{currentMission.text}</p>
                <button onClick={handleDeleteMission} className="delete-btn">
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedType === "activities" && (
        <div className="aboutus-content">
          <div className="aboutus-card">
            <h3>Add New Activity</h3>
            <form onSubmit={handleAddActivity}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && <img src={imagePreview} alt="Preview" className="preview-img" />}
              <button type="submit">Add Activity</button>
            </form>
          </div>

          <div className="aboutus-card">
            <h3>Activities List</h3>
            {activities.length === 0 ? (
              <p className="empty-text">No activities yet</p>
            ) : (
              activities.map(({ id, title, description, image }) => (
                <div key={id} className="activity-item">
                  {image && <img src={image} alt={title} className="activity-img" />}
                  <div>
                    <h4>{title}</h4>
                    <p>{description}</p>
                    <button onClick={() => handleDeleteActivity(id)} className="delete-btn">
                      Remove
                    </button>
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

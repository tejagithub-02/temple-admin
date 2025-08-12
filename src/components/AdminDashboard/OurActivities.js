import React, { useState } from "react";
import "./OurActivities.css";

const OurActivities = () => {
  const [activities, setActivities] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
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
      image: imagePreview, // store base64 preview
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
    <div className="ouractivities-container">
      <div className="ouractivities-header">
        <h2>Our Activities Management</h2>
      </div>

      <div className="ouractivities-content">
        {/* Add / Replace Activities */}
        <div className="ouractivities-upload-card">
          <h3>Add New Activity</h3>
          <form onSubmit={handleAddActivity} className="ouractivities-upload-form">
            <div className="ouractivities-form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter activity title"
                required
              />
            </div>

            <div className="ouractivities-form-group">
              <label>Description</label>
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter activity description"
                required
                className="ouractivities-textarea"
              />
            </div>

            <div className="ouractivities-form-group">
              <label>Image (optional)</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="ouractivities-image-preview"
                />
              )}
            </div>

            <button type="submit" className="ouractivities-save-button">
              Add Activity
            </button>
          </form>
        </div>

        {/* List of Activities */}
        <div className="ouractivities-list-card">
          <h3>Activities List</h3>
          {activities.length === 0 ? (
            <div className="ouractivities-empty">
              <p>No activities added yet</p>
            </div>
          ) : (
            activities.map(({ id, title, description, image }) => (
              <div key={id} className="ouractivities-item">
                {image && (
                  <img
                    src={image}
                    alt={title}
                    className="ouractivities-item-image"
                  />
                )}
                <div className="ouractivities-item-content">
                  <h4 className="ouractivities-item-title">{title}</h4>
                  <p className="ouractivities-item-description">
                    {description.split("\n").map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                  <button
                    onClick={() => handleDeleteActivity(id)}
                    className="ouractivities-delete-button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OurActivities;

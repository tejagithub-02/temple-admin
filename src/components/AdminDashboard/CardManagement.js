import React, { useState } from "react";
import "./CardManagement.css";

const CardManagement = () => {
  // ---------------- Toast ----------------
  const [toast, setToast] = useState({ message: "", type: "" });
  const showMessage = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  // ---------------- Cards ----------------
  const [cards, setCards] = useState([]);
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [cardImage, setCardImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editingCard, setEditingCard] = useState(null);

  // ---------------- Card Handlers ----------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCardImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const resetCardForm = () => {
    setEditingCard(null);
    setCardTitle("");
    setCardDescription("");
    setCardImage(null);
    setPreviewImage(null);
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!cardTitle.trim() || !cardDescription.trim())
      return showMessage("Please enter title and description", "error");

    const newCard = {
      id: Date.now(),
      title: cardTitle.trim(),
      description: cardDescription.trim(),
      img: previewImage,
    };

    if (editingCard) {
      setCards((prev) =>
        prev.map((c) => (c.id === editingCard.id ? newCard : c))
      );
      showMessage("Card updated successfully", "success");
    } else {
      setCards((prev) => [newCard, ...prev]);
      showMessage("Card added successfully", "success");
    }

    resetCardForm();
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setCardTitle(card.title);
    setCardDescription(card.description);
    setPreviewImage(card.img);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteCard = (id) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    showMessage("Card removed successfully", "success");
  };

  // ---------------- UI ----------------
  return (
    <div className="card-page">
      {/* Toast */}
      {toast.message && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      {/* Add / Edit Card */}
      <div className="card-content">
        <div className="card-box">
          <h3>{editingCard ? "Edit Card" : "Add New Card"}</h3>
          <form onSubmit={handleAddCard}>
            <input
              type="text"
              placeholder="Enter title..."
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
            />
            <textarea
              rows={4}
              placeholder="Enter description..."
              value={cardDescription}
              onChange={(e) => setCardDescription(e.target.value)}
            />
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {previewImage && (
              <div className="preview-box">
                <img src={previewImage} alt="Preview" height="100" />
              </div>
            )}
            <button type="submit">
              {editingCard ? "Update Card" : "Save Card"}
            </button>
            {editingCard && (
              <button type="button" onClick={resetCardForm}>
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Card List */}
        <div className="card-box">
          <h3>Current Cards</h3>
          {cards.length === 0 ? (
            <p className="empty-text">No cards added yet</p>
          ) : (
            cards.map((card) => (
              <div key={card.id} className="card-item">
                <div style={{ flex: 1 }}>
                  <h4>{card.title}</h4>
                  <p>
                    {card.description.split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </p>

                </div>
                {card.img && (
                  <img src={card.img} alt={card.title} className="card-image" />
                )}
                <div className="card-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditCard(card)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteCard(card.id)}
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

export default CardManagement;

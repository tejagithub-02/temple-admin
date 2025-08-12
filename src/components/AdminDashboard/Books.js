import React, { useState } from "react";
import "./Books.css";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null); // store image as base64 URL or file URL

  // Convert uploaded image file to base64 URL
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
    }
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please enter both title and description");
      return;
    }
    const newBook = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      image,
    };
    setBooks([newBook, ...books]);
    setTitle("");
    setDescription("");
    setImage(null);
    e.target.reset();
  };

  const handleDeleteBook = (id) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  return (
    <div className="books-container">
      <h2>Add New Book</h2>
      <form className="books-form" onSubmit={handleAddBook}>
        <div className="form-group">
          <label>Book Cover Image (optional)</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter book title"
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter book description"
            required
          />
        </div>

        <button type="submit" className="add-book-button">
          Add Book
        </button>
      </form>

      <hr />

      <h2>Books List</h2>
      {books.length === 0 ? (
        <p className="empty-message">No books added yet.</p>
      ) : (
        <div className="books-list">
          {books.map(({ id, title, description, image }) => (
            <div className="book-card" key={id}>
              {image && <img src={image} alt={title} className="book-image" />}
              <div className="book-details">
                <h3 className="book-title">{title}</h3>
                <p className="book-description">{description}</p>
              </div>
              <button
                className="delete-book-button"
                onClick={() => handleDeleteBook(id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;

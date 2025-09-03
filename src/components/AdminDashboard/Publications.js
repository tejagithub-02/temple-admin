import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Publications.css";

const Publications =() =>
{
  const [selectedType, setSelectedType] = useState("Books");

  //BOOK STATE
  const [ books, setBooks ] = useState([]);
  const [bookTitle, setBookTitle] = useState("");
  const [bookDescription, setBookDescription]= useState("");
  const [bookFile, setBookFile] = useState(null);

  //ARTICLES STATE 
  const [articles , setArticles]=useState([]);
  const [articleTitle, setArticleTitle] = useState("");
  const [pdfFile,setPdfFile] = useState(null);

  //EDIT STATE
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFile, setEditFile] = useState(null);


  //Notifications

  const [notification, setNotification] = useState(null);

  const API_BASE=process.env.REACT_APP_BACKEND_API;
  const token = localStorage.getItem("userToken")

  const axiosAuth =axios.create({
    baseURL:`${API_BASE}api/publication`,
    headers: 
    {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch Books & Articles
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axiosAuth.get("/books");
        if (res.data.success) setBooks(res.data.data);
      } catch (err) {
        console.error(err);
        showNotification("Error fetching books", "error");
      }
    };
    const fetchArticles = async () => {
      try {
        const res = await axiosAuth.get("/articles");
        if (res.data.success) setArticles(res.data.data);
      } catch (err) {
        console.error(err);
        showNotification("Error fetching articles", "error");
      }
    };
    fetchBooks();
    fetchArticles();
  }, []);
  // File Handlers
  const handleBookFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setBookFile(file);
  };
  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      setPdfFile(null);
      showNotification("Please select a valid PDF", "error");
    }
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setEditFile(file);
  };

  // Add Book
  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!bookTitle.trim() || !bookDescription.trim() || !bookFile) {
      return showNotification("Please fill all required fields", "error");
    }

    const formData = new FormData();
    formData.append("title", bookTitle.trim());
    formData.append("description", bookDescription.trim());
    formData.append("type", "Books");
    formData.append("file", bookFile);

    try {
      const res = await axiosAuth.post("/addPublication", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        setBooks([res.data.data, ...books]);
        setBookTitle("");
        setBookDescription("");
        setBookFile(null);
        e.target.reset();
        showNotification("Book added successfully");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error adding book", "error");
    }
  };

  // Add Article
  const handleAddArticle = async (e) => {
    e.preventDefault();
    if (!articleTitle.trim() || !pdfFile) {
      return showNotification("Please fill all required fields", "error");
    }

    const formData = new FormData();
    formData.append("title", articleTitle.trim());
    formData.append("description", "");
    formData.append("type", "Articles");
    formData.append("file", pdfFile);

    try {
      const res = await axiosAuth.post("/addPublication", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        setArticles([res.data.data, ...articles]);
        setArticleTitle("");
        setPdfFile(null);
        e.target.reset();
        showNotification("Article added successfully");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error adding article", "error");
    }
  };

  // Update Publication
  const handleUpdatePublication = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      return showNotification("Title is required", "error");
    }

    const formData = new FormData();
    formData.append("title", editTitle.trim());
    formData.append("description", editDescription.trim());
    if (editFile) formData.append("file", editFile);

    try {
      const res = await axiosAuth.put(`/updatePublication/${editingItem._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        if (editingItem.type === "Books") {
          setBooks(books.map((b) => (b._id === editingItem._id ? res.data.data : b)));
        } else {
          setArticles(articles.map((a) => (a._id === editingItem._id ? res.data.data : a)));
        }
        showNotification("Updated successfully");
        setEditingItem(null);
        setEditTitle("");
        setEditDescription("");
        setEditFile(null);
      }
    } catch (err) {
      console.error(err);
      showNotification("Error updating publication", "error");
    }
  };

  // Delete Publication
  const handleDelete = async (id, type) => {
    try {
      const res = await axiosAuth.delete(`/deletepublication/${id}`);
      if (res.data.success) {
        if (type === "Books") {
          setBooks(books.filter((b) => b._id !== id));
        } else {
          setArticles(articles.filter((a) => a._id !== id));
        }
        showNotification("Deleted successfully");
      } else {
        showNotification("Failed to delete", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error deleting item", "error");
    }
  };

  return (
    <div className="page-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <h1 className="page-title">Library Management</h1>

      {/* Selector */}
      <div className="selector-container">
        <label>Select Type: </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="Books">Books</option>
          <option value="Articles">Articles</option>
        </select>
      </div>

      {/* EDIT FORM */}
      {editingItem && (
        <div className="edit-form-container">
          <h2>Edit {editingItem.type}</h2>
          <form className="form" onSubmit={handleUpdatePublication}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </div>
            {editingItem.type === "Books" && (
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>
            )}
            <div className="form-group">
              <label>Upload New File (optional)</label>
              <input type="file" onChange={handleEditFileChange} />
            </div>
            <button type="submit" className="primary-button">Update</button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setEditingItem(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* BOOKS */}
      {selectedType === "Books" && (
        <div className="books-container">
          <h2>Add New Book</h2>
          <form className="form" onSubmit={handleAddBook}>
            <div className="form-group">
              <label>Book Cover Image *</label>
              <input type="file" accept="image/*" onChange={handleBookFileChange} />
            </div>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea
                rows={5}
                value={bookDescription}
                onChange={(e) => setBookDescription(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="primary-button">
              Add Book
            </button>
          </form>

          <h2>Books List</h2>
          {books.length === 0 ? (
            <p className="empty-message">No books added yet.</p>
          ) : (
            <div className="list">
              {books.map(({ _id, title, description, file_url, type }) => (
                <div className="card" key={_id}>
                  {file_url && <img src={file_url} alt={title} className="image" />}
                  <div className="details">
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                  <div className="actions">
                    <button
                      className="edit-button"
                      onClick={() => {
                        setEditingItem({ _id, type });
                        setEditTitle(title);
                        setEditDescription(description);
                        setEditFile(null);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(_id, "Books")}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ARTICLES */}
      {selectedType === "Articles" && (
        <div className="articles-container">
          <h2>Add New Article</h2>
          <form className="form" onSubmit={handleAddArticle}>
            <div className="form-group">
              <label>Upload PDF *</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfChange}
                required
              />
              {pdfFile && <p className="file-preview">Selected File: {pdfFile.name}</p>}
            </div>
            <div className="form-group">
              <label>Article Title *</label>
              <input
                type="text"
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="primary-button">
              Add Article
            </button>
          </form>

          <h2>Articles List</h2>
          {articles.length === 0 ? (
            <p className="empty-message">No articles added yet.</p>
          ) : (
            <div className="list">
              {articles.map(({ _id, title, file_url, file_type, type }) => (
                <div className="card" key={_id}>
                  <div className="details">
                    <h3>{title}</h3>
                    {file_type === "pdf" && (
                      <a href={file_url} target="_blank" rel="noopener noreferrer">
                        View PDF
                      </a>
                    )}
                  </div>
                  <div className="actions">
                    <button
                      className="edit-button"
                      onClick={() => {
                        setEditingItem({ _id, type });
                        setEditTitle(title);
                        setEditDescription("");
                        setEditFile(null);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(_id, "Articles")}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Publications;

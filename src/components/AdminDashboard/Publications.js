import React, { useState } from "react";
import "./Publications.css";

const Publications = () => {
  const [selectedType, setSelectedType] = useState("Books");

  // BOOKS STATE
  const [books, setBooks] = useState([]);
  const [bookTitle, setBookTitle] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [bookImage, setBookImage] = useState(null);

  // ARTICLES STATE
  const [articles, setArticles] = useState([]);
  const [articleTitle, setArticleTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  // Image Upload for Books
  const handleBookImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBookImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setBookImage(null);
    }
  };

  // Add Book
  const handleAddBook = (e) => {
    e.preventDefault();
    if (!bookTitle.trim() || !bookDescription.trim()) {
      alert("Please enter both title and description");
      return;
    }
    const newBook = {
      id: Date.now(),
      title: bookTitle.trim(),
      description: bookDescription.trim(),
      image: bookImage,
    };
    setBooks([newBook, ...books]);
    setBookTitle("");
    setBookDescription("");
    setBookImage(null);
    e.target.reset();
  };

  // Delete Book
  const handleDeleteBook = (id) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  // PDF Upload for Articles
  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setPdfFile({ file, url });
    } else {
      setPdfFile(null);
      alert("Please select a PDF file");
    }
  };

  // Add Article
  const handleAddArticle = (e) => {
    e.preventDefault();
    if (!articleTitle.trim()) {
      alert("Please enter article title");
      return;
    }
    if (!pdfFile) {
      alert("Please upload a PDF file");
      return;
    }
    const newArticle = {
      id: Date.now(),
      title: articleTitle.trim(),
      pdfUrl: pdfFile.url,
      fileName: pdfFile.file.name,
    };
    setArticles([newArticle, ...articles]);
    setArticleTitle("");
    setPdfFile(null);
    e.target.reset();
  };

  // Delete Article
  const handleDeleteArticle = (id) => {
    const article = articles.find((a) => a.id === id);
    if (article) {
      URL.revokeObjectURL(article.pdfUrl);
    }
    setArticles(articles.filter((a) => a.id !== id));
  };

  return (
    <div className="page-container">
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

      {selectedType === "Books" && (
        <div className="books-container">
          <h2>Add New Book</h2>
          <form className="form" onSubmit={handleAddBook}>
            <div className="form-group">
              <label>Book Cover Image (optional)</label>
              <input type="file" accept="image/*" onChange={handleBookImageChange} />
            </div>

            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                placeholder="Enter book title"
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                rows={5}
                value={bookDescription}
                onChange={(e) => setBookDescription(e.target.value)}
                placeholder="Enter book description"
                required
              />
            </div>

            <button type="submit" className="primary-button">
              Add Book
            </button>
          </form>

          <hr />

          <h2>Books List</h2>
          {books.length === 0 ? (
            <p className="empty-message">No books added yet.</p>
          ) : (
            <div className="list">
              {books.map(({ id, title, description, image }) => (
                <div className="card" key={id}>
                  {image && <img src={image} alt={title} className="image" />}
                  <div className="details">
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteBook(id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedType === "Articles" && (
        <div className="articles-container">
          <h2>Add New Article</h2>
          <form className="form" onSubmit={handleAddArticle}>
            <div className="form-group">
              <label>Upload PDF *</label>
              <input type="file" accept="application/pdf" onChange={handlePdfChange} required />
              {pdfFile && <p className="file-preview">Selected File: {pdfFile.file.name}</p>}
            </div>

            <div className="form-group">
              <label>Article Title *</label>
              <input
                type="text"
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                placeholder="Enter article title"
                required
              />
            </div>

            <button type="submit" className="primary-button">
              Add Article
            </button>
          </form>

          <hr />

          <h2>Articles List</h2>
          {articles.length === 0 ? (
            <p className="empty-message">No articles added yet.</p>
          ) : (
            <div className="list">
              {articles.map(({ id, title, pdfUrl, fileName }) => (
                <div className="card" key={id}>
                  <div className="details">
                    <h3>{title}</h3>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                      View PDF: {fileName}
                    </a>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteArticle(id)}
                  >
                    Remove
                  </button>
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

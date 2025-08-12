import React, { useState } from "react";
import "./Articles.css";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  // Convert uploaded PDF file to object URL for preview
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

  const handleAddArticle = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter article title");
      return;
    }
    if (!pdfFile) {
      alert("Please upload a PDF file");
      return;
    }
    const newArticle = {
      id: Date.now(),
      title: title.trim(),
      pdfUrl: pdfFile.url,
      fileName: pdfFile.file.name,
    };
    setArticles([newArticle, ...articles]);
    setTitle("");
    setPdfFile(null);
    e.target.reset();
  };

  const handleDeleteArticle = (id) => {
    // Revoke object URL to free memory
    const article = articles.find((a) => a.id === id);
    if (article) {
      URL.revokeObjectURL(article.pdfUrl);
    }
    setArticles(articles.filter((article) => article.id !== id));
  };

  return (
    <div className="articles-container">
      <h2>Add New Article</h2>
      <form className="articles-form" onSubmit={handleAddArticle}>
        <div className="form-group">
          <label>Upload PDF *</label>
          <input type="file" accept="application/pdf" onChange={handlePdfChange} required />
          {pdfFile && <p className="file-preview">Selected File: {pdfFile.file.name}</p>}
        </div>

        <div className="form-group">
          <label>Article Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title"
            required
          />
        </div>

        <button type="submit" className="add-article-button">
          Add Article
        </button>
      </form>

      <hr />

      <h2>Articles List</h2>
      {articles.length === 0 ? (
        <p className="empty-message">No articles added yet.</p>
      ) : (
        <div className="articles-list">
          {articles.map(({ id, title, pdfUrl, fileName }) => (
            <div className="article-card" key={id}>
              <div className="article-details">
                <h3 className="article-title">{title}</h3>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="article-link">
                  View PDF: {fileName}
                </a>
              </div>
              <button
                className="delete-article-button"
                onClick={() => handleDeleteArticle(id)}
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

export default Articles;

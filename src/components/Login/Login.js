import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "./Auth.css";

export default function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem("isLoggedIn", "true"); // save login state
      setIsAuthenticated(true);
      navigate("/dashboard");
    }
  };
  

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login</h2>

        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-btn">Login</button>
        <p className="auth-link">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

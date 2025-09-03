import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios";
import "./Auth.css";

export default function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword ] = useState("");
 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      // API request
      const res = await axios.post(
        "https://testtapi1.ap-1.evennode.com/api/admin/loginAdmin",
        { email, password}
      );

      if (res.data.status) {
        alert(res.data.message);

        // Save token and user info to localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userToken", res.data.admin.tokens[0].token);
        localStorage.setItem("userEmail", res.data.admin.email);
        localStorage.setItem("userRole", res.data.admin.role);
        localStorage.setItem("userId", res.data.admin._id);
        setIsAuthenticated(true);
        navigate("/dashboard");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(
        error.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
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

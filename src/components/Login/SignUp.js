import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import "./Auth.css";

const API_BASE = process.env.REACT_APP_BACKEND_API; // must end with /


export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("admin"); // start empty for placeholder
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
  
    if (!email || !name || !password || !confirmPassword || !role) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all fields.",
        confirmButtonColor: "#6366f1",
      });
      return;
    }
  
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match.",
        confirmButtonColor: "#ef4444",
      });
      return;
    }
  
    try {
      const res = await axios.post(`${API_BASE}api/admin/adminRegistration`, {
        name,
        email,
        password,
      });
  
      if (res.data.Status) {
        Swal.fire({
          icon: "success",
          title: "Signup Successful",
          text: res.data.message,
          timer: 2000,
          showConfirmButton: false,
        });
  
        localStorage.setItem("userToken", res.data.data.tokens[0].token);
        localStorage.setItem("userRole", res.data.data.role);
        localStorage.setItem("userEmail", res.data.data.email);
  
        setTimeout(() => navigate("/login"), 2000); // redirect after popup
      } else {
        Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text: "Please try again.",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong. Please try again later.",
        confirmButtonColor: "#ef4444",
      });
    }
  };
  
  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSignup}>
        <h2>Sign Up</h2>

        {/* Name */}
        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="input-group">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
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

        {/* Confirm Password */}
        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

      


        {/* Submit */}
        <button type="submit" className="auth-btn">Sign Up</button>

        {/* Redirect to login */}
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

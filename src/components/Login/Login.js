import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";   // ✅ Import SweetAlert2
import "./Auth.css";

const API_BASE = process.env.REACT_APP_BACKEND_API; // must end with /

export default function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword ] = useState("");
 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please enter email and password.",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}api/admin/loginAdmin`, { email, password });

      if (res.data.status) {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: res.data.message,
          timer: 2000,
          showConfirmButton: false,
        });

        // Save token and user info
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userToken", res.data.admin.tokens[0].token);
        localStorage.setItem("userEmail", res.data.admin.email);
        localStorage.setItem("userRole", res.data.admin.role);
        localStorage.setItem("userId", res.data.admin._id);

        setIsAuthenticated(true);
        setTimeout(() => navigate("/dashboard"), 2000); // redirect after popup
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Please check your credentials.",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
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

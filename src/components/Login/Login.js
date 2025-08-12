import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Swal from "sweetalert2";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showError = (msg) => {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: msg,
    });
  };

  const handleLogin = () => {
    const { email, password } = form;

    if (!email || !password) {
      return showError("Please enter both email and password.");
    }

    // ✅ Simulated login without API
    if (email === "admin@example.com" && password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("adminName", "Admin User");
      localStorage.setItem("adminEmail", email);

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: `Welcome back, Admin User`,
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        window.dispatchEvent(new Event("login-status-changed"));
        window.location.href = "/dashboard";
      }, 2000);
    } else {
      showError("Invalid email or password.");
    }
  };

  return (
    <div className="login-containers">
      <div className="login-box">
        <h2>Login</h2>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
        />
        <button onClick={handleLogin}>Login</button>
        <p>
          Don't have an account?{" "}
          <span className="signup-link" onClick={() => navigate("/signup")}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;

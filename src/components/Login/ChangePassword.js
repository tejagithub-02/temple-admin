import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./ChangePassword.css";

const API_BASE = process.env.REACT_APP_BACKEND_API; // must end with /


export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
  e.preventDefault();

  if (newPassword !== confirmNewPassword) {
    Swal.fire({
      icon: "error",
      title: "Password Mismatch",
      text: "New passwords do not match!",
      confirmButtonColor: "#ef4444",
    });
    return;
  }

  try {
    const token = localStorage.getItem("userToken");
    const userId = localStorage.getItem("userId");

    const res = await axios.patch(
      `${API_BASE}api/admin/editAdminPassword/${userId}`,
      {
        oldPassword: oldPassword,
        newPassword: newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.data.status) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message || "Password updated successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => navigate("/dashboard"), 2000); // redirect after popup
    } else {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: res.data.message || "Password update failed.",
        confirmButtonColor: "#ef4444",
      });
    }
  } catch (error) {
    console.error("Change password error:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.response?.data?.message || "Something went wrong. Please try again later.",
      confirmButtonColor: "#ef4444",
    });
  }
};


  return (
    <div className="cp-container">
      <form className="cp-form" onSubmit={handleChangePassword}>
        <h2 className="cp-heading">Change Password</h2>

        <label className="cp-label">Old Password</label>
        <input
          type="password"
          placeholder="Enter old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="cp-input"
          required
        />

        <label className="cp-label">New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="cp-input"
          required
        />

        <label className="cp-label">Confirm New Password</label>
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          className="cp-input"
          required
        />

        <button type="submit" className="cp-btn">
          Update Password
        </button>
      </form>
    </div>
  );
}

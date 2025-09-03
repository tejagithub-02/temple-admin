import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ChangePassword.css";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const token = localStorage.getItem("userToken");
      const userId = localStorage.getItem("userId");

      // Changed POST to PUT and updated body keys
      const res = await axios.patch(
        `https://testtapi1.ap-1.evennode.com/api/admin/editAdminPassword/${userId}`,
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
        alert(res.data.message); // "Password updated successfully"
        navigate("/dashboard");
      } else {
        alert(res.data.message || "Password update failed.");
      }
    } catch (error) {
      console.error("Change password error:", error);
      alert(
        error.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
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

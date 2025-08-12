import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout({ setIsLoggedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/");
  }, [navigate, setIsLoggedIn]);

  return null;
}

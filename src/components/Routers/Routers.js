import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "../Login/Login";
import SignUp from "../Login/SignUp";
import ChangePassword from "../Login/ChangePassword";
import Logout from "../Login/Logout";

import DashboardLayout from "../Layout/DashboardLayout";
import Dashboard from "../Dashboard/Dashboard";
import TempleBookings from "../Dashboard/TempleBookings";
import Banner from "../AdminDashboard/Banner";
import Events from "../AdminDashboard/Events";
import Gallery from "../AdminDashboard/Gallery";
import Scrolling from "../AdminDashboard/Scrolling";
import Youtube from "../AdminDashboard/Youtube";
import OurMission from "../AdminDashboard/OurMission";
import OurActivities from "../AdminDashboard/OurActivities";
import Books from "../AdminDashboard/Books";
import Articles from "../AdminDashboard/Articles";
import GeneralSevas from "../AdminDashboard/GeneralSevas";
import EventSpecificSevas from "../AdminDashboard/EventSpecificSevas";
import RecurringEvents from "../AdminDashboard/RecurringEvents";

const Routers = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const auth = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(auth === "true");
    setIsLoading(false);
  }, []);

  if (isLoading) return null; // wait until auth check is done

  return (
    <Router>
      <Routes>
        {!isLoggedIn ? (
          <>
            {/* Public Routes */}
            <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<SignUp setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            {/* Protected Routes */}
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="temple-bookings" element={<TempleBookings />} />
              <Route path="banner" element={<Banner />} />
              <Route path="add-events" element={<Events />} />
              <Route path="recurring-events" element={<RecurringEvents />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="scrolling" element={<Scrolling />} />
              <Route path="youtube" element={<Youtube />} />
              <Route path="about-us/our-mission" element={<OurMission />} />
              <Route path="about-us/our-activities" element={<OurActivities />} />
              <Route path="publications/books" element={<Books />} />
              <Route path="publications/articles" element={<Articles />} />
              <Route path="add-sevas/general" element={<GeneralSevas />} />
              <Route path="add-sevas/event-specific" element={<EventSpecificSevas />} />
              <Route path="logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />
            </Route>
          </>
        )}
      </Routes>
    </Router>
  );
};

export default Routers;

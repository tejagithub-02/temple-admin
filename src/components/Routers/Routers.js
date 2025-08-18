import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../Layout/DashboardLayout";
import Dashboard from "../Dashboard/Dashboard";
import TempleBookings from "../Dashboard/TempleBookings";
import EventBookings from "../Dashboard/EventBookings";
import SevaBookings from "../Dashboard/SevaBookings";
import Banner from "../AdminDashboard/Banner";
import Events from "../AdminDashboard/Events";
import Gallery from "../AdminDashboard/Gallery";
import Scrolling from "../AdminDashboard/Scrolling";
import Youtube from "../AdminDashboard/Youtube";
import Publications from "../AdminDashboard/Publications";
import RecurringEvents from "../AdminDashboard/RecurringEvents";
import AddSevas from "../AdminDashboard/AddSevas";

import AboutUs from "../AdminDashboard/AboutUs";
import ChangePassword from "../Login/ChangePassword";


const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="temple-bookings" element={<TempleBookings />} />
          <Route path="event-bookings" element={<EventBookings />} />
          <Route path="seva-bookings" element={<SevaBookings />} />
          
          <Route path="banner" element={<Banner />} />
          <Route path="add-events" element={<Events />} />
          <Route path="recurring-events" element={<RecurringEvents />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="scrolling" element={<Scrolling />} />
          <Route path="youtube" element={<Youtube />} />
          <Route path="aboutus" element={<AboutUs />} />
         
          <Route path="add-sevas" element={<AddSevas />} />
         
          <Route path="publications" element={<Publications />} />
          <Route path="change-password" element={<ChangePassword />} />
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default Routers;

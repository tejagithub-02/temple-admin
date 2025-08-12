import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import DashboardLayout from "../Layout/DashboardLayout";
import Dashboard from '../Dashboard/Dashboard';
import TempleBookings from '../Dashboard/TempleBookings';
import Banner from '../AdminDashboard/Banner';
import Events from '../AdminDashboard/Events';
import Gallery from '../AdminDashboard/Gallery';
import Scrolling from '../AdminDashboard/Scrolling';
import Youtube from '../AdminDashboard/Youtube';
import OurMission from '../AdminDashboard/OurMission';
import OurActivities from '../AdminDashboard/OurActivities';
import Books from '../AdminDashboard/Books';
import Articles from '../AdminDashboard/Articles';


// Dummy components for now (replace with actual pages)


const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          {/* Redirect base path to /dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Main pages */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="temple-bookings" element={<TempleBookings />} />
          <Route path="banner" element={<Banner />} />
          <Route path="add-events" element={<Events />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="scrolling" element={<Scrolling />} />
          <Route path="youtube" element={<Youtube />} />
          <Route path="/about-us/our-mission" element={<OurMission/>}/>
          <Route path="/about-us/our-activities" element={<OurActivities/>}/>
          <Route path="/publications/books" element={<Books/>}/>
          <Route path="/publications/articles" element={<Articles/>}/>
        </Route>
      </Routes>
    </Router>
  );
};

export default Routers;

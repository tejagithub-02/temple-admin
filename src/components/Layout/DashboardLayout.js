
import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "../Navbar/DashboardNavbar";
import DashboardSidebar from "../Navbar/DashboardSidebar";
import "./DashboardLayout.css";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const setIsLoggedIn = (value) => {
    localStorage.setItem("isLoggedIn", value);
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <DashboardSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        setIsLoggedIn={setIsLoggedIn}
      />

      {/* Main Area */}
      <div className="dashboard-main">
        <DashboardNavbar toggleSidebar={toggleSidebar} />
        <div className="dashboard-content">
          <Outlet context={{ isSidebarOpen }} />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;

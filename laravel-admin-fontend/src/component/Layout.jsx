import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";


export default function Layout() {
  const { logout } = useContext(AuthContext);
   const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (

<div className="d-flex" style={{ height: "100vh" }}>
      {/* Sidebar */}
       <Sidebar
    isSidebarOpen={isSidebarOpen}
/>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light">
        {/* Top Bar */}
        <nav className="navbar navbar-light bg-white shadow-sm px-3">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
          <div className="ms-auto">
            <button className="btn btn-danger btn-sm" onClick={logout}>
              <i className="fas fa-sign-out-alt me-1"></i> Logout
            </button>
          </div>
        </nav>

        {/* Dynamic Page Content */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

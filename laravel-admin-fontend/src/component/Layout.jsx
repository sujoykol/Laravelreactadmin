import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, Outlet } from "react-router-dom";
import { useState } from "react";


export default function Layout() {
  const { logout } = useContext(AuthContext);
   const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (

<div className="d-flex" style={{ height: "100vh" }}>
      {/* Sidebar */}
      <div
        className={`bg-dark text-white p-3 ${isSidebarOpen ? "d-block" : "d-none"}`}
        style={{ width: "250px" }}
      >
        <h4 className="mb-4">Admin Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link text-white">
              <i className="fas fa-home me-2"></i> Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/categories" className="nav-link text-white">
              <i className="fas fa-users me-2"></i> Categories
            </Link>
          </li>
            <li className="nav-item">
            <Link to="/products" className="nav-link text-white">
              <i className="fas fa-users me-2"></i> Products
            </Link>
          </li>
          
            <li className="nav-item">
            <Link to="/sliders" className="nav-link text-white">
              <i className="fas fa-users me-2"></i> Sliders
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/customers" className="nav-link text-white">
              <i className="fas fa-users me-2"></i> Customers
            </Link>
          </li>
            <li className="nav-item">
            <Link to="/roles" className="nav-link text-white">
              <i className="fas fa-users me-2"></i> Roles
            </Link>
          </li>
           <li className="nav-item">
            <Link to="/permissions" className="nav-link text-white">
              <i className="fas fa-users me-2"></i> Permission
            </Link>
          </li>
           <li className="nav-item">
            <Link to="/users" className="nav-link text-white">
              <i className="fas fa-users me-2"></i> Users
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/changepassword" className="nav-link text-white">
              <i className="fas fa-cog me-2"></i> Settings
            </Link>
          </li>
        </ul>
      </div>

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

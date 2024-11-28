import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUsers, FaBuilding, FaTasks, FaUserTie, FaSignOutAlt } from "react-icons/fa"; // Icons
import axiosInstance from "../apiService"; 

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const email = localStorage.getItem("email");
      if (!email) {
        navigate("/login", { replace: true });
        return;
      }

      // API call to logout
      await axiosInstance.post("/api/admin-logout", { email });

      // Clear local storage upon successful logout
      localStorage.clear();

      // Redirect to login page
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login", { replace: true });
      }
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-primary navbar-dark">
      <div className="container-fluid">
        <Link to="/employees" className="navbar-brand text-white">
          HRMS
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-between" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/employees" className="nav-link text-white">
                <FaUsers className="me-1" /> Employees
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/clients" className="nav-link text-white">
                <FaBuilding className="me-1" /> Clients
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/employee-role-assign" className="nav-link text-white">
                <FaTasks className="me-1" /> Employee Role Assign
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/assigned-employee" className="nav-link text-white">
                <FaUserTie className="me-1" /> Assigned Employee
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/department" className="nav-link text-white">
                <FaBuilding className="me-1" /> Department
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/jobRole" className="nav-link text-white">
                <FaTasks className="me-1" /> Job Role
              </Link>
            </li>
          </ul>
          <button className="btn btn-danger btn-logout" onClick={handleLogout}>
            <FaSignOutAlt className="me-1" /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

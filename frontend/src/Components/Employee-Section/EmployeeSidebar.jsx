import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaFileAlt, FaCalendarAlt, FaUser, FaBullhorn } from "react-icons/fa";
import './EmployeeSidebar.css'; 

const EmployeeSidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowSidebar(true);
    }, 100); 
  }, []);

  return (
    <div className={`employee-sidebar bg-dark text-white p-3 vh-100 ${showSidebar ? "show" : ""}`}>
      <div className="employee-sidebar-header mb-4 border-bottom pb-3 text-center">
        <FaUser size={40} className="mb-2" />
        <h6>
          Welcome, <span>Akshaya</span>
        </h6>
      </div>

      <Nav className="flex-column">
        <Nav.Link as={Link} to="/employee-dashboard" className="sidebar-link text-white">
          <FaTachometerAlt className="me-2" />
          Dashboard
        </Nav.Link>
        <Nav.Link as={Link} to="/profile" className="sidebar-link text-white">
          <FaUser className="me-2" />
          Profile
        </Nav.Link>
        <Nav.Link as={Link} to="/apply-leave" className="sidebar-link text-white">
          <FaFileAlt className="me-2" />
          Leave
        </Nav.Link>
        <Nav.Link as={Link} to="/employee-attendance" className="sidebar-link text-white">
          <FaCalendarAlt className="me-2" />
          Attendance
        </Nav.Link>
        <Nav.Link as={Link} to="/employee-broadcast" className="sidebar-link text-white">
          <FaBullhorn className="me-2" />
          Broadcast
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default EmployeeSidebar;

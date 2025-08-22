import React, { useEffect, useState } from "react";
import { Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaFileAlt, 
  FaCalendarAlt, 
  FaUser, 
  FaBullhorn, 
  FaChartLine,
  FaMoneyCheckAlt,
  FaSignOutAlt
} from "react-icons/fa";
import "./EmployeeSidebar.css"; 

const EmployeeSidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowSidebar(true);
    }, 100); 
  }, []);

  const handleLogout = () => {
    localStorage.clear();  
    window.location.href = "/employee-login"; 
  };

  return (
    <div className={`employee-sidebar bg-dark text-white p-3 vh-100 d-flex flex-column justify-content-between ${showSidebar ? "show" : ""}`}>
      
      <div>
        {/* Sidebar Header */}
        <div className="employee-sidebar-header mb-4 border-bottom pb-3 text-center">
          <FaUser size={40} className="mb-2" />
          <h6>
            Welcome, <span>Akshaya</span>
          </h6>
        </div>

        {/* Sidebar Links */}
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
          <Nav.Link as={Link} to="/performance-tracker" className="sidebar-link text-white">
            <FaChartLine className="me-2" />
            Performance Tracker
          </Nav.Link>
          <Nav.Link as={Link} to="/employee-payroll" className="sidebar-link text-white">
            <FaMoneyCheckAlt className="me-2" />
            Payroll 
          </Nav.Link>
        </Nav>
      </div>

      {/* Logout Button */}
      <div className="mt-4">
        <Button 
          variant="danger" 
          className="w-100 d-flex align-items-center justify-content-center"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="me-2" /> Logout
        </Button>
      </div>
    </div>
  );
};

export default EmployeeSidebar;

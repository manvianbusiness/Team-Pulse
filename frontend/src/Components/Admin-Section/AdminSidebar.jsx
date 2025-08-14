import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarAlt,
  FaUser,
  FaBullhorn,
  FaCalendarPlus 
} from "react-icons/fa";
import "animate.css"; // Import animate.css
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const [showLeavesMenu, setShowLeavesMenu] = useState(false);

  const toggleLeavesMenu = () => {
    setShowLeavesMenu(!showLeavesMenu);
  };

  return (
    <div className="admin-sidebar animate__animated animate__fadeInLeft">
      <div className="admin-sidebar-header">
        <FaUser size={40} className="mb-2  icon-hover"  />
        <h6>Welcome,</h6>
        <span>Admin</span>
      </div>

      <Nav className="admin-sidebar-nav d-flex flex-column gap-2">
        <Nav.Link as={Link} to="/admin-dashboard" className="sidebar-link">
          <FaTachometerAlt className="me-2"  data-icon-hover /> Dashboard
        </Nav.Link>

        <Nav.Link as={Link} to="/employees-list" className="sidebar-link">
          <FaUsers className="me-2"  data-icon-hover/> Employees
        </Nav.Link>

        <Nav.Link as={Link} to="/attendance" className="sidebar-link">
          <FaCalendarAlt className="me-2"  data-icon-hover /> Attendance
        </Nav.Link>

        <Nav.Link as={Link} to="/admin-broadcast" className="sidebar-link">
          <FaBullhorn className="me-2"  data-icon-hover/> Broadcast Messages
        </Nav.Link>

        <Nav.Link as={Link} to="/addleavetype" className="sidebar-link">
          <FaCalendarPlus  className="me-2"  data-icon-hover/> Add Leave
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default AdminSidebar;

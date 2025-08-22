import React, { useState } from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarAlt,
  FaUser,
  FaBullhorn,
  FaCalendarPlus,
  FaChartBar,
  FaEdit,
} from "react-icons/fa";
import "animate.css";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const [showLeavesMenu, setShowLeavesMenu] = useState(false);

  return (
    <div
      className="admin-sidebar animate__animated animate__fadeInLeft"
      style={{ backgroundColor: "black", height: "100vh", padding: "1rem" }}
    >
      <div
        className="admin-sidebar-header"
        style={{ textAlign: "center", marginBottom: "1rem" }}
      >
        <FaUser size={40} className="mb-2" style={{ color: "white" }} />
        <h6 style={{ color: "white", marginBottom: 0 }}>Welcome,</h6>
        <span style={{ color: "white" }}>Admin</span>
      </div>

      <Nav className="d-flex flex-column gap-2">
        {/* Normal links */}
        {[
          { to: "/admin-dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
          { to: "/employees-list", icon: <FaUsers />, label: "Employees" },
          { to: "/attendance", icon: <FaCalendarAlt />, label: "Attendance" },
          { to: "/admin-broadcast", icon: <FaBullhorn />, label: "Broadcast Messages" },
          { to: "/addleavetype", icon: <FaCalendarPlus />, label: "Add Leave" },
        ].map((item, idx) => (
          <Nav.Link
            as={Link}
            to={item.to}
            key={idx}
            style={{ color: "white", display: "flex", alignItems: "center" }}
          >
            <span style={{ marginRight: "8px" }}>{item.icon}</span>
            {item.label}
          </Nav.Link>
        ))}

        {/* Performance Dropdown */}
        <NavDropdown
          title={
            <span style={{ display: "flex", alignItems: "center", color: "white" }}>
              <FaChartBar style={{ marginRight: "8px" }} />
              Performance
            </span>
          }
          id="performance-dropdown"
          menuVariant="dark"
          style={{ padding: 0 }}
        >
          <NavDropdown.Item
            as={Link}
            to="/employeeperformance"
            style={{ color: "white", display: "flex", alignItems: "center" }}
          >
            <FaEdit style={{ marginRight: "8px" }} /> Performance Manager
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="/performance"
            style={{ color: "white", display: "flex", alignItems: "center" }}
          >
            <FaChartBar style={{ marginRight: "8px" }} /> Monthly Performance
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </div>
  );
};

export default AdminSidebar;

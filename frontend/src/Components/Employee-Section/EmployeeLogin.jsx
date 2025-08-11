import React, { useState } from "react";
import slide1 from "../../assets/slide2.png";
import slide2 from "../../assets/slide3.png";
import {
  Form,
  Button,
  Container,
  Card,
  Row,
  Col,
  Alert,
  Carousel,
  ToggleButtonGroup,
  ToggleButton
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "./EmployeeLogin.css";

const EmployeeLogin = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [roleView, setRoleView] = useState("employee"); // toggle state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginUrl =
      roleView === "employee"
        ? "http://127.0.0.1:5000/employee_login"
        : "http://127.0.0.1:5000/admin_login";

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const { user_id, role } = data;

      if (role.toLowerCase() === roleView) {
        localStorage.setItem("userId", user_id);
        localStorage.setItem("userRole", role);
        navigate(
          roleView === "employee" ? "/employee-dashboard" : "/admin-dashboard"
        );
      } else {
        alert("Access denied: Wrong role");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setErrorMsg(error.message);
    }
  };

  return (
    <Container fluid className="employee-login-container">
      <Row className="align-items-center justify-content-center vh-100">
        <Col md={6} className="text-center">
          <Carousel fade interval={3000} controls={false} indicators={false} pause={false} wrap={true}>
            <Carousel.Item>
              <img className="d-block w-100 login-image" src={slide1} alt="Slide 1" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100 login-image" src={slide2} alt="Slide 2" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100 login-image" src={slide1} alt="Slide 3" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100 login-image" src={slide2} alt="Slide 4" />
            </Carousel.Item>
          </Carousel>
        </Col>

        <Col md={4}>
          <Card className="login-card p-4 shadow">
            {/* 🔹 Role Toggle */}
            <ToggleButtonGroup
              type="radio"
              name="roleToggle"
              value={roleView}
              onChange={(val) => setRoleView(val)}
              className="mb-4 w-100"
            >
              <ToggleButton
                id="tbg-btn-1"
                value="employee"
                variant={roleView === "employee" ? "primary" : "outline-primary"}
              >
                Employee
              </ToggleButton>
              <ToggleButton
                id="tbg-btn-2"
                value="admin"
                variant={roleView === "admin" ? "primary" : "outline-primary"}
              >
                Admin
              </ToggleButton>
            </ToggleButtonGroup>

            <h3 className="text-center mb-4">
              {roleView === "employee" ? "Employee Login" : "Admin Login"}
            </h3>

            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaUser className="me-2" />
                  Username / Email
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your username or email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>
                  <FaLock className="me-2" />
                  Password
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Login
              </Button>
            </Form>

            {/* 🔹 Register Buttons */}
            <div className="text-center mt-3">
              <Link
                to={roleView === "employee" ? "/register-employee" : "/register-admin"}
                className="btn btn-outline-secondary w-100"
              >
                Register as {roleView.charAt(0).toUpperCase() + roleView.slice(1)}
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EmployeeLogin;

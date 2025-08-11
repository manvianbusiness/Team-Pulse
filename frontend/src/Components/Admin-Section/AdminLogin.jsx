import React, { useState } from "react";
import { Form, Button, Container, Card, Row, Col, Carousel } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import slide1 from "../../assets/slide2.png";
import slide2 from "../../assets/slide3.png";
import slide3 from "../../assets/login.png";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/admin_login", {
        method: "POST",
        credentials: "include", // ✅ send cookies
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }), // ✅ use state values
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Store in localStorage for React checks
        localStorage.setItem("userId", data.user_id);
        localStorage.setItem("role", data.role);

        // Redirect to admin dashboard
        navigate("/admin-dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please check if backend is running.");
    }
  };

  return (
    <Container fluid className="admin-login-container">
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
              <img className="d-block w-100 login-image" src={slide3} alt="Slide 3" />
            </Carousel.Item>
          </Carousel>
        </Col>

        <Col md={4}>
          <Card className="login-card p-4 shadow">
            <h3 className="text-center mb-4">Admin Login</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={handleAdminLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Username or Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username or email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Login
              </Button>
            </Form>
            <div className="text-center mt-3">
              <Link to="/employee-login">Login as Employee</Link>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLogin;

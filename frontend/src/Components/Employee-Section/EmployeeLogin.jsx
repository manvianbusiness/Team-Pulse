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
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "./EmployeeLogin.css"; // optional if you add custom styles

const EmployeeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleEmployeeLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.role === "employee") {
        setErrorMsg("");
        localStorage.setItem("employee", JSON.stringify(data));
        console.log("Employee Login Successful:", data);
        navigate("/employee-dashboard");
      } else {
        setErrorMsg(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Server error. Please try again later.");
    }
  };

  return (
    <Container fluid className="employee-login-container">
      <Row className="align-items-center justify-content-center vh-100">
        <Col md={6} className="text-center">
          <Carousel
            fade
            interval={3000}
            controls={false}
            indicators={false}
            pause={false}
            wrap={true}
          >
            <Carousel.Item>
              <img
                className="d-block w-100 login-image"
                src={slide1}
                alt="Slide 1"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100 login-image"
                src={slide2}
                alt="Slide 2"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100 login-image"
                src={slide1}
                alt="Slide 3"
              />
            </Carousel.Item>
              <Carousel.Item>
              <img
                className="d-block w-100 login-image"
                src={slide2}
                alt="Slide 4"
              />
            </Carousel.Item>
          </Carousel>
        </Col>

        <Col md={4}>
          <Card className="login-card p-4 shadow">
            <h3 className="text-center mb-4">Employee Login</h3>

            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

            <Form onSubmit={handleEmployeeLogin}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaUser className="me-2" />
                  Email address
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter employee email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              <Link to="/">Login as Admin</Link>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EmployeeLogin;

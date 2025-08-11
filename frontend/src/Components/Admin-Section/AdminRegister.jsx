// AdminRegister.js
import React, { useState } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Container,
  Card,
  Alert,
  Row,
  Col,
  Carousel
} from "react-bootstrap";
import { Link } from "react-router-dom";

import slide1 from "../../assets/slide2.png";
import slide2 from "../../assets/slide3.png";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "admin", // ✅ fixed to admin
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post("http://127.0.0.1:5000/register", formData);
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Container
      fluid
      className="vh-100 d-flex align-items-center justify-content-center bg-light"
    >
      <Row
        className="w-100 shadow-lg rounded overflow-hidden"
        style={{ maxWidth: "1000px" }}
      >
        {/* Left Column - Carousel */}
        <Col md={6} className="d-none d-md-block p-0">
          <Carousel fade interval={2500} controls={false} indicators={false}>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={slide1}
                alt="Slide 1"
                style={{ objectFit: "cover", height: "100%" }}
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={slide2}
                alt="Slide 2"
                style={{ objectFit: "cover", height: "100%" }}
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={slide1}
                alt="Slide 3"
                style={{ objectFit: "cover", height: "100%" }}
              />
            </Carousel.Item>
          </Carousel>
        </Col>

        {/* Right Column - Registration Form */}
        <Col
          md={6}
          className="bg-white p-4 d-flex flex-column justify-content-center"
        >
          <Card className="border-0">
            <h3 className="mb-4 text-primary text-center">
              Admin Registration
            </h3>

            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  name="username"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  name="first_name"
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  name="last_name"
                  onChange={handleChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Register
              </Button>

              {/* Login Link */}
              <div className="text-center mt-3">
                <small>
                  Already have an account?{" "}
                  <Link to="/" className="text-decoration-none">
                    Login
                  </Link>
                </small>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminRegister;

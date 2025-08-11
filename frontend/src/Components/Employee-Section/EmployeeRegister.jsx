import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

const EmployeeRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "employee"
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
    <Container className="mt-5">
      <Card className="p-4 shadow">
        <h3 className="mb-4">Employee Registration</h3>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control name="username" onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control name="first_name" onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control name="last_name" onChange={handleChange} />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Register
          </Button>

          {/* Employee Login Link */}
          <div className="text-center mt-3">
            <small>
              Already have an account?{" "}
              <Link to="/employee-login" className="text-decoration-none">
                Login here
              </Link>
            </small>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default EmployeeRegister;

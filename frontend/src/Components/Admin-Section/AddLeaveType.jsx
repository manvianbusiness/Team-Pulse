import React, { useState } from "react";
import { Button, Card, Container, Form, Alert } from "react-bootstrap";
import AdminSidebar from "./AdminSidebar";
import "animate.css";
import "./AddLeaveType.css";

const AddLeaveType = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    max_days_per_year: 12,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "max_days_per_year" ? parseInt(value, 10) : value,
    }));
  };

  // Simulate Admin Login
  const handleAdminLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/admin_login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: "new_admin",
          password: "password",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data);
        setMessage(`Login successful! User ID: ${data.user_id}, Role: ${data.role}`);
        setError("");
      } else {
        setError(`Login failed: ${data.message}`);
        setMessage("");
      }
    } catch (err) {
      setError("Network error during login. Is the server running?");
      setMessage("");
    }
  };

  // Submit Leave Type
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser || currentUser.role !== "admin") {
      setError('Admin access required. Please simulate admin login first.');
      setMessage("");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/leave_types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": currentUser.role,
          "X-User-ID": currentUser.user_id,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`Leave type added successfully! ID: ${result.id}`);
        setError("");
        setFormData({
          name: "",
          description: "",
          max_days_per_year: 12,
        });
      } else {
        setError(`Error: ${result.message}`);
        setMessage("");
      }
    } catch (err) {
      setError("Network error. Is the backend server running?");
      setMessage("");
    }
  };

  return (
    <div className="d-flex add-leave-page">
      <AdminSidebar />
      <Container className="mt-4">
        <Card className="leave-card animate__animated animate__fadeInRight">
          <Card.Body>
            <Card.Title className="form-title">Add Leave Type</Card.Title>

            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Button className="mb-3" onClick={handleAdminLogin}>
              Simulate Admin Login
            </Button>

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="name">
                <Form.Label>Leave Type Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter leave type..."
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="description" className="mt-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  placeholder="Enter description..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="max_days_per_year" className="mt-3">
                <Form.Label>Max Days Per Year</Form.Label>
                <Form.Control
                  type="number"
                  name="max_days_per_year"
                  placeholder="e.g. 12"
                  value={formData.max_days_per_year}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button className="mt-4 add-btn" type="submit">
                Add Leave Type
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default AddLeaveType;

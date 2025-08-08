import React, { useState, useEffect } from "react";
import { Button, Card, Container, Form, Alert } from "react-bootstrap";
import AdminSidebar from "./AdminSidebar";

const AddLeaveType = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    max_days_per_year: 12,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");
    if (userId && role === "admin") {
      setCurrentUser({ user_id: userId, role });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "max_days_per_year" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser || currentUser.role !== "admin") {
      setError("Admin access required. Please log in first.");
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
        setFormData({ name: "", description: "", max_days_per_year: 12 });
      } else {
        setError(result.message);
        setMessage("");
      }
    } catch (err) {
      setError("Network error. Is the backend running?");
      setMessage("");
    }
  };

  return (
    <div className="d-flex">
      <AdminSidebar />
      <Container className="mt-4">
        <Card>
          <Card.Body>
            <Card.Title>Add Leave Type</Card.Title>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Leave Type Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Max Days Per Year</Form.Label>
                <Form.Control
                  type="number"
                  name="max_days_per_year"
                  value={formData.max_days_per_year}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button className="mt-4" type="submit">
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

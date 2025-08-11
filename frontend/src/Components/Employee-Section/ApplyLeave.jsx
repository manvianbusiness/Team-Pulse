import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import axios from "axios";
import EmployeeSidebar from "./EmployeeSidebar";

const LeaveRequestForm = () => {
  const [formData, setFormData] = useState({
    leave_type_id: "",
    start_date: "",
    end_date: "",
    reason: "",
    num_days: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [variant, setVariant] = useState("success");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    if (!userId || role !== "employee") {
      setResponseMessage("Please log in as an employee before applying for leave.");
      setVariant("danger");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/leave_requests",
        {
          ...formData,
          user_id: localStorage.getItem("userId"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-User-Role": localStorage.getItem("role"),
            "X-User-ID": localStorage.getItem("userId"),
          },
        }
      );

      setVariant("success");
      setResponseMessage(res.data.message);
      setFormData({
        leave_type_id: "",
        start_date: "",
        end_date: "",
        reason: "",
        num_days: "",
      });

      // Dispatch custom event to notify dashboard for update
      window.dispatchEvent(new Event("leaveRequestUpdated"));
    } catch (err) {
      setVariant("danger");
      setResponseMessage(err?.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="d-flex">
      <EmployeeSidebar />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Body>
                <Card.Title className="text-center mb-4">Leave Request Form</Card.Title>
                {responseMessage && <Alert variant={variant}>{responseMessage}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label>Leave Type ID</Form.Label>
                    <Form.Control
                      type="number"
                      name="leave_type_id"
                      value={formData.leave_type_id}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mt-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mt-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mt-3">
                    <Form.Label>Reason</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mt-3">
                    <Form.Label>Number of Days</Form.Label>
                    <Form.Control
                      type="number"
                      name="num_days"
                      value={formData.num_days}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Button type="submit" className="mt-4 w-100">
                    Submit Request
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LeaveRequestForm;

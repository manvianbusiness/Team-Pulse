import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import './ApplyLeave.css';
import EmployeeSidebar from './EmployeeSidebar';

const ApplyLeave = () => {
  const [form, setForm] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate & submit logic here
    setSubmitted(true);
  };

  return (
    <div className="d-flex apply-leave-page">
      <EmployeeSidebar />

      <Container className="apply-leave-container">
        <Card className="apply-leave-card p-4 shadow-lg">
          <h3 className="text-center mb-4 text-primary apply-leave-title">
            Apply for Leave
          </h3>

          {submitted && (
            <Alert variant="success" className="apply-leave-alert">
              Leave request submitted successfully!
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Label className="apply-leave-label">
                  <FaFileAlt className="me-2 text-success" />
                  Leave Type
                </Form.Label>
                <Form.Select
                  name="leaveType"
                  value={form.leaveType}
                  onChange={handleChange}
                  className="apply-leave-input"
                  required
                >
                  <option value="">Select</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Paid Leave">Paid Leave</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Label className="apply-leave-label">
                  <FaCalendarAlt className="me-2 text-danger" />
                  From Date
                </Form.Label>
                <Form.Control
                  type="date"
                  name="fromDate"
                  value={form.fromDate}
                  onChange={handleChange}
                  className="apply-leave-input"
                  required
                />
              </Col>
              <Col>
                <Form.Label className="apply-leave-label">
                  <FaCalendarAlt className="me-2 text-danger" />
                  To Date
                </Form.Label>
                <Form.Control
                  type="date"
                  name="toDate"
                  value={form.toDate}
                  onChange={handleChange}
                  className="apply-leave-input"
                  required
                />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="apply-leave-label">Reason</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reason"
                value={form.reason}
                onChange={handleChange}
                className="apply-leave-input"
                placeholder="Explain the reason for leave"
                required
              />
            </Form.Group>

            <div className="d-grid mt-4">
              <Button variant="primary" type="submit" size="lg" className="apply-leave-button">
                Submit Leave Request
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default ApplyLeave;

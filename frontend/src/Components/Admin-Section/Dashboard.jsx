import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminSidebar from './AdminSidebar.jsx';

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [rejected, setRejected] = useState(0);

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token"); // If using JWT

useEffect(() => {
  const fetchRequests = async () => {
    try {
      setLoading(true); // Start loading

      const response = await fetch("http://127.0.0.1:5000/admin/leave_requests", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": "admin", // required for backend auth
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const resData = await response.json();

      // If backend returns { requests: [...] }
      const data = resData.requests || resData || [];

      setRequests(data);

      // Update counts
      setPending(data.filter(r => r.status?.toLowerCase() === "pending").length);
      setApproved(data.filter(r => r.status?.toLowerCase() === "approved").length);
      setRejected(data.filter(r => r.status?.toLowerCase() === "declined" || r.status?.toLowerCase() === "rejected").length);

    } catch (error) {
      console.error("Error fetching leave requests:", error);
      setError("Failed to fetch leave requests");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  fetchRequests();
}, [token]);


  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div>
      <AdminSidebar />   
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h3>Welcome, {username}</h3>

          <div className="d-flex gap-2 flex-wrap">
            <Link to="/leave-policies">
              <Button variant="info" className="text-white">
                View Leave Policies
              </Button>
            </Link>
            <Button variant="outline-danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <Row className="mb-4">
          <Col md={4} sm={12}>
            <Card className="text-center p-3 shadow-sm border-primary">
              <h6 className="text-primary fw-bold">Pending Requests</h6>
              <h2 className="text-primary">{pending}</h2>
            </Card>
          </Col>
          <Col md={4} sm={12}>
            <Card className="text-center p-3 shadow-sm border-success">
              <h6 className="text-success fw-bold">Approved Leaves</h6>
              <h2 className="text-success">{approved}</h2>
            </Card>
          </Col>
          <Col md={4} sm={12}>
            <Card className="text-center p-3 shadow-sm border-danger">
              <h6 className="text-danger fw-bold">Rejected Leaves</h6>
              <h2 className="text-danger">{rejected}</h2>
            </Card>
          </Col>
        </Row>

        {/* Leave Requests Table */}
        <Card className="shadow-sm">
          <Card.Body>
            <h5 className="mb-3">Your Leave Requests</h5>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : (
              <Table bordered responsive hover>
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Leave Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-3">
                        No leave requests found
                      </td>
                    </tr>
                  ) : (
                    requests.map((req, index) => (
                      <tr key={req.request_id}>
                        <td>{index + 1}</td>
                        <td>{req.leave_type_name}</td>
                        <td>{req.start_date}</td>
                        <td>{req.end_date || req.start_date}</td>
                        <td>
                          <span
                            className={
                              req.status.toLowerCase() === "approved"
                                ? "text-success fw-bold"
                                : req.status.toLowerCase() === "pending"
                                ? "text-warning fw-bold"
                                : "text-danger fw-bold"
                            }
                          >
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Dashboard;

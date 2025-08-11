import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Alert, Button } from "react-bootstrap";
import axios from "axios";

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [rejected, setRejected] = useState(0);

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://127.0.0.1:5000/employee/${userId}/leave_requests`);
        const data = res.data || [];
        setRequests(data);

        setPending(data.filter(r => r.status?.toLowerCase() === "pending").length);
        setApproved(data.filter(r => r.status?.toLowerCase() === "approved").length);
        setRejected(data.filter(r => r.status?.toLowerCase() === "declined").length);
      } catch (err) {
        setError("Failed to load leave requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Welcome, {username}</h3>
        <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
      </div>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center p-3">
            <h6>Pending Requests</h6>
            <h4>{pending}</h4>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center p-3">
            <h6>Approved Leaves</h6>
            <h4>{approved}</h4>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center p-3">
            <h6>Rejected Leaves</h6>
            <h4>{rejected}</h4>
          </Card>
        </Col>
      </Row>

      {/* Leave Requests Table */}
      <Card>
        <Card.Body>
          <h5>Your Leave Requests</h5>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <Table bordered responsive>
              <thead>
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
                    <td colSpan="5" className="text-center">No leave requests found</td>
                  </tr>
                ) : (
                  requests.map((req, index) => (
                    <tr key={req.request_id}>
                      <td>{index + 1}</td>
                      <td>{req.leave_type_name}</td>
                      <td>{req.start_date}</td>
                      <td>{req.end_date || req.start_date}</td>
                      <td>{req.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;

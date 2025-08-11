import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, ListGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../Admin-Section/AdminSidebar';
import './Dashboard.css';

const Dashboard = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const userId = localStorage.getItem('userId');

  const fetchLeaveRequests = async () => {
    if (!userId) {
      console.warn("User ID not found in localStorage");
      return;
    }
    try {
      const url = `http://127.0.0.1:5000/admin/leave_requests`;

      const res = await axios.get(url, {
        headers: {
          "X-User-Role": localStorage.getItem("role"),
          "X-User-ID": userId
        }
      });

      console.log('Raw leave requests data:', res.data);
      setLeaveRequests(res.data || []);
    } catch (err) {
      console.error('Error fetching leave requests:', err);
      setLeaveRequests([]); // clear on error
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  useEffect(() => {
    const handleLeaveRequestUpdated = () => {
      fetchLeaveRequests();
    };

    window.addEventListener('leaveRequestUpdated', handleLeaveRequestUpdated);

    return () => {
      window.removeEventListener('leaveRequestUpdated', handleLeaveRequestUpdated);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(fetchLeaveRequests, 10000); // polling every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handleApprove = (index) => {
    const updatedRequests = [...leaveRequests];
    updatedRequests[index].status = 'Approved';
    setLeaveRequests(updatedRequests);

    // TODO: Call backend API to approve request, then fetchLeaveRequests()
  };

  const handleReject = (index) => {
    const updatedRequests = [...leaveRequests];
    updatedRequests[index].status = 'Rejected';
    setLeaveRequests(updatedRequests);

    // TODO: Call backend API to reject request, then fetchLeaveRequests()
  };

  return (
    <div className='d-flex'>
      <AdminSidebar />

      <Container fluid className="dashboard-container p-4 bg-light min-vh-100" style={{ marginLeft: '250px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ color: '#19BDE8' }}>Admin Dashboard</h2>
          <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
        </div>

        <Row className="mb-4 g-4">
          <Col md={3}>
            <Card className="dashboard-card text-white shadow-sm">
              <Card.Body>
                <Card.Title>Total Employees</Card.Title>
                <h4>150</h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="dashboard-card text-white shadow-sm">
              <Card.Body>
                <Card.Title>Pending Requests</Card.Title>
                <h4>{leaveRequests.filter(req => req.status.toLowerCase() === 'pending').length}</h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="dashboard-card text-white shadow-sm">
              <Card.Body>
                <Card.Title>Approved Leaves</Card.Title>
                <h4>{leaveRequests.filter(req => req.status.toLowerCase() === 'approved').length}</h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="dashboard-card text-white shadow-sm">
              <Card.Body>
                <Card.Title>Rejected Leaves</Card.Title>
                <h4>{leaveRequests.filter(req => req.status.toLowerCase() === 'rejected').length}</h4>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Leave Requests Table */}
        <Row>
          <Col md={12}>
            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="mb-3 text-white">Leave Requests</h5>
                <Table responsive bordered hover>
                  <thead className="leave-table text-center">
                    <tr>
                      <th>#</th>
                      <th>Employee</th>
                      <th>Leave Type</th>
                      <th>Dates</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-center align-middle">
                    {leaveRequests.length === 0 ? (
                      <tr>
                        <td colSpan="6">No leave requests found.</td>
                      </tr>
                    ) : (
                      leaveRequests.map((req, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{req.employee_username}</td>
                          <td>{req.leave_type_name}</td>
                          <td>
                            {req.start_date}
                            {req.end_date && req.end_date !== req.start_date ? ` to ${req.end_date}` : ''}
                          </td>
                          <td>
                            <span className={`badge px-3 py-2 fs-6 
                              ${req.status.toLowerCase() === 'approved' ? 'bg-success' :
                                req.status.toLowerCase() === 'rejected' ? 'bg-danger' :
                                'pending-status'}`}>
                              {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center gap-2">
                              <Button
                                size="sm"
                                className="btn-plain-success"
                                onClick={() => handleApprove(i)}
                                disabled={req.status.toLowerCase() === 'approved'}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                className="btn-plain-danger"
                                onClick={() => handleReject(i)}
                                disabled={req.status.toLowerCase() === 'rejected'}
                              >
                                Reject
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Leave Policies & Reports */}
        <Row className="mt-4 g-4">
          <Col md={6}>
            <Card className="shadow-sm"  style={{backgroundColor:"#19BDE8"}}>
              <Card.Body>
                <h5 className="text-black">Leave Policy Settings</h5>
                <ListGroup variant="flush">
                  <Link to="/leave-policies" className="text-decoration-none text-black">View All Leave Policies</Link>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;

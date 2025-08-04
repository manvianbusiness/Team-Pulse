import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, ListGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AdminSidebar from '../Admin-Section/AdminSidebar';
import './Dashboard.css';

const initialLeaveRequests = [
  { employee: 'Joe', type: 'Vacation', dates: '2024-05-10 to 2024-05-12', status: 'Pending' },
  { employee: 'Jack', type: 'Sick', dates: '2024-05-05 to 2024-05-09', status: 'Approved' },
  { employee: 'Michael', type: 'Vacation', dates: '2024-05-15 to 2024-05-18', status: 'Rejected' },
  { employee: 'Emily', type: 'Sick', dates: '2024-05-07', status: 'Pending' }
];

const Dashboard = () => {
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handleApprove = (index) => {
    const updatedRequests = [...leaveRequests];
    updatedRequests[index].status = 'Approved';
    setLeaveRequests(updatedRequests);
  };

  const handleReject = (index) => {
    const updatedRequests = [...leaveRequests];
    updatedRequests[index].status = 'Rejected';
    setLeaveRequests(updatedRequests);
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
                <h4>{leaveRequests.filter(req => req.status === 'Pending').length}</h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="dashboard-card text-white shadow-sm">
              <Card.Body>
                <Card.Title>Approved Leaves</Card.Title>
                <h4>{leaveRequests.filter(req => req.status === 'Approved').length}</h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="dashboard-card text-white shadow-sm">
              <Card.Body>
                <Card.Title>Rejected Leaves</Card.Title>
                <h4>{leaveRequests.filter(req => req.status === 'Rejected').length}</h4>
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
                    {leaveRequests.map((req, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{req.employee}</td>
                        <td>{req.type}</td>
                        <td>{req.dates}</td>
                        <td>
                          <span className={`badge px-3 py-2 fs-6 
                            ${req.status === 'Approved' ? 'bg-success' :
                              req.status === 'Rejected' ? 'bg-danger' :
                              'pending-status'}`}>
                            {req.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <Button
                              size="sm"
                              className="btn-plain-success"
                              onClick={() => handleApprove(i)}
                              disabled={req.status === 'Approved'}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              className="btn-plain-danger"
                              onClick={() => handleReject(i)}
                              disabled={req.status === 'Rejected'}
                            >
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
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

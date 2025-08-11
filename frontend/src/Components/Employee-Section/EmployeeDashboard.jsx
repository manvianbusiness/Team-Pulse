import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ProgressBar,
  Button,
  ListGroup,
  Table,
  Badge,
} from "react-bootstrap";
import { FaCalendarAlt, FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import EmployeeSidebar from "./EmployeeSidebar";
import "./EmployeeDashboard.css";
import WelcomeIllustration from "../../assets/WelcomeIllustration.png";
import axios from "axios";

const EmployeeDashboard = () => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [totalLeaves, setTotalLeaves] = useState(20);
  const [leavesTaken, setLeavesTaken] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState(0);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    let interval;

    const fetchLeaveHistory = async () => {
      try {
        if (!userId) return;
        const response = await axios.get(
          `http://127.0.0.1:5000/users/${userId}/leave_requests`,
          {
            headers: {
              "X-User-ID": userId,
              "X-User-Role": "employee",
            },
          }
        );
        const data = response.data;
        setLeaveHistory(data);

        const approvedDays = data
          .filter((leave) => leave.status.toLowerCase() === "approved")
          .reduce((sum, leave) => sum + parseFloat(leave.num_days || 0), 0);

        const pendingCount = data.filter(
          (leave) => leave.status.toLowerCase() === "pending"
        ).length;

        setLeavesTaken(approvedDays);
        setPendingLeaves(pendingCount);
      } catch (error) {
        console.error("Error fetching leave history:", error);
      }
    };

    fetchLeaveHistory();
    interval = setInterval(fetchLeaveHistory, 5000); // refresh every 5 seconds

    return () => clearInterval(interval);
  }, [userId]);

  const remainingLeaves = totalLeaves - leavesTaken;
  const leavePercentage = totalLeaves > 0 ? (leavesTaken / totalLeaves) * 100 : 0;

  const holidays = [
    { name: "Independence Day", date: "2024-08-15" },
    { name: "Onam", date: "2024-09-15" },
    { name: "Diwali", date: "2024-11-01" },
    { name: "Christmas", date: "2024-12-25" },
  ];

  return (
    <div className="dashboard-wrapper d-flex">
      <div className="sidebar">
        <EmployeeSidebar />
      </div>

      <div className="main-content flex-grow-1">
        <Container fluid className="p-4">
          {/* Welcome Section */}
          <Row className="mb-4 align-items-center">
            <Col md={8}>
              <Card className="shadow-sm p-4 d-flex flex-row align-items-center justify-content-between welcome-card">
                <div className="me-4">
                  <h4 className="fw-bold mb-2">Welcome, Akshaya 👋</h4>
                  <p className="text-muted mb-0">
                    Manage all the things from this dashboard – Leave requests,
                    tasks, and profile updates.
                  </p>
                </div>
                <Col md={4}>
                  <img
                    src={WelcomeIllustration}
                    alt="Welcome Illustration"
                    className="img-fluid rounded-3 welcome-img"
                  />
                </Col>
              </Card>
            </Col>
          </Row>

          {/* Leave Summary */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-white card-blue text-center p-3">
                <h6>Total Leaves</h6>
                <h4>{totalLeaves}</h4>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-white card-green text-center p-3">
                <h6>Leaves Taken</h6>
                <h4>{leavesTaken}</h4>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-dark card-yellow text-center p-3">
                <h6>Remaining</h6>
                <h4>{remainingLeaves}</h4>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-white card-red text-center p-3">
                <h6>Pending</h6>
                <h4>{pendingLeaves}</h4>
              </Card>
            </Col>
          </Row>

          {/* Leave Usage & Notifications */}
          <Row className="mb-4">
            <Col md={8}>
              <Card className="shadow-sm p-3">
                <h5>Leave Usage</h5>
                <ProgressBar
                  now={leavePercentage}
                  label={`${leavePercentage.toFixed(0)}% used`}
                />
                <div className="d-flex gap-3 mt-4">
                  <Button variant="primary" href="/apply-leave">
                    Apply Leave
                  </Button>
                  <Button variant="outline-secondary" href="/profile">
                    View Profile
                  </Button>
                </div>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm p-3">
                <h5>
                  <FaBell className="me-2" /> Notifications
                </h5>
                <ListGroup variant="flush">
                  <ListGroup.Item>Leave approved on 28th July</ListGroup.Item>
                  <ListGroup.Item>Update your profile info</ListGroup.Item>
                  <ListGroup.Item>Company off on 15th Aug</ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          {/* Leave History & Holidays */}
          <Row className="mb-4">
            <Col md={7}>
              <Card className="shadow-sm p-3">
                <h5>Leave History</h5>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>From</th>
                      <th>To</th>
                      <th>Type</th>
                      <th>Duration</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveHistory.length > 0 ? (
                      leaveHistory.map((leave, i) => (
                        <tr key={i}>
                          <td>{leave.start_date}</td>
                          <td>{leave.end_date}</td>
                          <td>{leave.leave_type}</td>
                          <td>{leave.num_days} Days</td>
                          <td>
                            <Badge
                              bg={
                                leave.status.toLowerCase() === "approved"
                                  ? "success"
                                  : leave.status.toLowerCase() === "pending"
                                  ? "warning"
                                  : "danger"
                              }
                            >
                              {leave.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No leave history found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card>
            </Col>

            <Col md={5}>
              <Card className="shadow-sm p-3">
                <h5>
                  <FaCalendarAlt className="me-2" /> Upcoming Holidays
                </h5>
                <ListGroup variant="flush">
                  {holidays.map((holiday, i) => (
                    <ListGroup.Item key={i}>
                      🎉 <strong>{holiday.name}</strong> - {holiday.date}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            </Col>
          </Row>

          {/* Comments & Quick Links */}
          <Row>
            <Col md={6}>
              <Card className="shadow-sm p-3">
                <h5>Manager Comments</h5>
                <p>"Good communication on leave planning. Keep it up!"</p>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm p-3">
                <h5>Quick Links</h5>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Link
                      to="/leave-policies"
                      className="text-decoration-none text-primary"
                    >
                      View All Leave Policies
                    </Link>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

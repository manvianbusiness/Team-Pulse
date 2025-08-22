import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar } from 'react-bootstrap';
import { FaAngleUp, FaCheckCircle, FaUsers, FaCode, FaBook, FaExclamationCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PerformanceTracker.css';
import EmployeeSidebar from './EmployeeSidebar';
import { useNavigate } from "react-router-dom";

const PerformanceTracker = () => {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState("Monthly"); // default view

  const summaryItems = [
    { label: 'Overall Score', value: '87.5%', change: '+5.2% from last month', color: 'success' },
    { label: 'Tasks Completed', value: '142', change: '+12 from last month', color: 'success' },
    { label: 'Avg Response Time', value: '2.3 hrs', change: '-0.5hrs from last month', color: 'danger' },
    { label: 'Team Rating', value: '4.6/5', change: '+0.3 from last month', color: 'success' },
  ];

  const goals = [
    { title: 'Complete certification in AWS', progress: 65, due: 'Dec 2024', status: 'ON TRACK', variant: 'success' },
    { title: 'Lead 2 major projects', progress: 50, due: 'Mar 2025', status: 'ON TRACK', variant: 'success' },
    { title: 'Mentor 3 junior developers', progress: 33, due: 'Jun 2025', status: 'BEHIND', variant: 'danger' },
  ];

  const activities = [
    { icon: <FaCheckCircle className="text-success" />, text: 'Completed Project Alpha milestone', time: '2 hours ago', status: 'COMPLETED' },
    { icon: <FaUsers className="text-info" />, text: 'Team standup meeting', time: '4 hours ago', status: 'COMPLETED' },
    { icon: <FaCode className="text-warning" />, text: 'Code review for Feature X', time: '6 hours ago', status: 'PENDING' },
    { icon: <FaBook className="text-primary" />, text: 'React Advanced Workshop', time: '1 day ago', status: 'COMPLETED' },
    { icon: <FaExclamationCircle className="text-danger" />, text: 'Project Beta due date approaching', time: '2 days ago', status: 'URGENT' },
  ];

  // Separate datasets for Daily, Weekly, Monthly
  const reports = {
    Daily: { score: 75, skills: { React: 80, Node: 70, JS: 90, Leadership: 60, ProblemSolving: 65 } },
    Weekly: { score: 82, skills: { React: 85, Node: 78, JS: 92, Leadership: 65, ProblemSolving: 72 } },
    Monthly: { score: 87.5, skills: { React: 90, Node: 85, JS: 95, Leadership: 70, ProblemSolving: 80 } },
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar-wrapper">
        <EmployeeSidebar />
      </div>

      {/* Main Dashboard */}
      <div className="content-wrapper flex-grow-1">
        <Container fluid className="p-4 dashboard-container">
          {/* Header */}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div className="d-flex align-items-center mb-3 mb-md-0">
                  <div className="profile-icon me-3">SJ</div>
                  <div>
                    <h5 className="mb-0">Sarah Johnson</h5>
                    <p className="text-muted mb-0">Senior Developer</p>
                    <p className="text-muted mb-0">Software Development • EMP-2024-001</p>
                  </div>
                </div>
                <div>
                  {/* Navigate to Tasks Page */}
                  <Button variant="outline-primary" className="me-2" onClick={() => navigate("/tasks")}>
                    View Tasks
                  </Button>
                  {/* Removed Performance Report button */}
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Performance Summary */}
          <Row className="g-4">
            {summaryItems.map((item, index) => (
              <Col key={index} md={6} lg={3}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="card-title mb-0">{item.label}</h6>
                      <FaAngleUp className="text-muted" />
                    </div>
                    <h2 className="mb-1">{item.value}</h2>
                    <p className={`mb-0 text-${item.color}`} style={{ fontSize: '0.9rem' }}>{item.change}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Goals & Objectives */}
          <Card className="p-4 mt-4 shadow-sm">
            <h5 className="mb-4">Current Goals & Objectives</h5>
            <Row className="g-4">
              {goals.map((goal, index) => (
                <Col key={index} md={6} lg={4}>
                  <Card className="h-100 goal-item shadow-sm">
                    <Card.Body>
                      <h6 className="mb-3">{goal.title}</h6>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted">Progress</small>
                        <small>{goal.progress}%</small>
                      </div>
                      <ProgressBar now={goal.progress} variant={goal.variant} className="mb-2" />
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">Due: {goal.due}</small>
                        <span className={`status-badge status-${goal.status.toLowerCase().replace(' ', '-')}`}>{goal.status}</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Activities & Breakdown */}
          <Row className="mt-4 g-4">
            {/* Recent Activities */}
            <Col md={6}>
              <Card className="p-4 h-100 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Recent Activities</h5>
                  <a href="/tasks" className="text-decoration-none">View all →</a>
                </div>
                <ul className="list-unstyled">
                  {activities.map((activity, index) => (
                    <li key={index} className="d-flex align-items-center mb-3">
                      <div className="activity-icon me-3">{activity.icon}</div>
                      <div className="flex-grow-1">
                        <p className="mb-0">{activity.text}</p>
                        <small className="text-muted">{activity.time}</small>
                      </div>
                      <span className={`status-badge status-${activity.status.toLowerCase()}`}>{activity.status}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Col>

            {/* Performance Breakdown */}
            <Col md={6}>
              <Card className="p-4 h-100 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Performance Breakdown</h5>
                  <div className="btn-group" role="group">
                    {["Daily", "Weekly", "Monthly"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`btn btn-sm ${reportType === type ? "btn-secondary" : "btn-outline-secondary"}`}
                        onClick={() => setReportType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Donut chart */}
                <div className="d-flex justify-content-center align-items-center mb-4">
                  <div className="donut-chart-container">
                    <svg className="donut-chart" viewBox="0 0 36 36">
                      <path
                        className="donut-chart-background"
                        d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0 -31.831"
                        fill="transparent"
                        stroke="#e6e6e6"
                        strokeWidth="3"
                      ></path>
                      <path
                        className="donut-chart-segment"
                        d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0 -31.831"
                        fill="transparent"
                        stroke="#007bff"
                        strokeWidth="3"
                        strokeDasharray={`${reports[reportType].score}, 100`}
                      ></path>
                    </svg>
                    <div className="donut-chart-text">
                      <h4>{reports[reportType].score}%</h4>
                      <p className="text-muted">{reportType}</p>
                    </div>
                  </div>
                </div>

                {/* Skills Progress */}
                <h6 className="mb-3">Key Skills</h6>
                {Object.entries(reports[reportType].skills).map(([skill, score], index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between">
                      <small>{skill}</small>
                      <small>{score}%</small>
                    </div>
                    <ProgressBar now={score} style={{ height: '8px' }} />
                  </div>
                ))}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default PerformanceTracker;

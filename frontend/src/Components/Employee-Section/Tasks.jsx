import React from "react";
import { Card, Container, Badge } from "react-bootstrap";
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaClock } from "react-icons/fa";
import EmployeeSidebar from "./EmployeeSidebar";

const Tasks = () => {
  const tasks = [
    { id: 1, title: "Fix UI bug in dashboard", status: "Completed", time: "Today" },
    { id: 2, title: "Update API integration", status: "Pending", time: "Today" },
    { id: 3, title: "Write unit tests", status: "In Progress", time: "Today" },
    { id: 4, title: "Prepare sprint report", status: "Pending", time: "Today" },
    { id: 5, title: "Optimize database queries", status: "In Progress", time: "Today" },
    { id: 6, title: "Review pull requests", status: "Completed", time: "Today" },
    { id: 7, title: "Update project documentation", status: "Pending", time: "Today" },
    { id: 8, title: "Conduct code review session", status: "Completed", time: "Today" },
    { id: 9, title: "Team meeting preparation", status: "In Progress", time: "Today" },
    { id: 10, title: "Deploy latest build", status: "Pending", time: "Today" },
    { id: 11, title: "Completed Project Alpha milestone", status: "Completed", time: "2 hours ago" },
    { id: 12, title: "Team standup meeting", status: "Completed", time: "4 hours ago" },
    { id: 13, title: "Code review for Feature X", status: "Pending", time: "6 hours ago" },
    { id: 14, title: "React Advanced Workshop", status: "Completed", time: "1 day ago" },
    { id: 15, title: "Project Beta due date approaching", status: "URGENT", time: "2 days ago" },
  ];

  // Status Badge Renderer
  const renderStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <Badge bg="success" className="p-2">
            <FaCheckCircle className="me-1" /> {status}
          </Badge>
        );
      case "In Progress":
        return (
          <Badge bg="warning" text="dark" className="p-2">
            <FaHourglassHalf className="me-1" /> {status}
          </Badge>
        );
      case "URGENT":
        return (
          <Badge bg="danger" className="p-2">
            ⚠️ {status}
          </Badge>
        );
      default:
        return (
          <Badge bg="secondary" className="p-2">
            <FaTimesCircle className="me-1" /> {status}
          </Badge>
        );
    }
  };

  return (
    <div>
      <EmployeeSidebar />
      <Container className="p-4">
        <h3 className="mb-4 fw-bold text-primary">📋 All Tasks</h3>
        {tasks.map((task) => (
          <Card
            key={task.id}
            className={`mb-3 shadow-sm border-0 ${
              task.status === "URGENT" ? "bg-danger text-white" : ""
            }`}
            style={{ transition: "0.3s", borderRadius: "12px" }}
          >
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="fw-semibold mb-1">{task.title}</h6>
                <small
                  className={task.status === "URGENT" ? "text-white" : "text-muted"}
                >
                  <FaClock className="me-1" /> {task.time}
                </small>
              </div>
              <div>{renderStatusBadge(task.status)}</div>
            </Card.Body>
          </Card>
        ))}
      </Container>
    </div>
  );
};

export default Tasks;

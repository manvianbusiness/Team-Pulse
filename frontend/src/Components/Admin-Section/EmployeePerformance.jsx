import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Form,
  Button,
  ProgressBar,
  Badge,
  Modal,
  Toast,
  ToastContainer,
  Tabs,
  Tab,
} from "react-bootstrap";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import "./EmployeePerformance.css";

const EmployeePerformance = () => {
  // ---------------- Employee Overview ----------------
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "John Doe",
      department: "Development",
      rating: 85,
      tasksCompleted: 48,
      feedback: "Excellent team player",
    },
    {
      id: 2,
      name: "Jane Smith",
      department: "Design",
      rating: 72,
      tasksCompleted: 35,
      feedback: "Good creative skills",
    },
    {
      id: 3,
      name: "David Johnson",
      department: "Marketing",
      rating: 60,
      tasksCompleted: 28,
      feedback: "Needs improvement in communication",
    },
    {
      id: 4,
      name: "Sarah Williams",
      department: "HR",
      rating: 90,
      tasksCompleted: 50,
      feedback: "Very supportive and proactive",
    },
  ]);

  // ---------------- Goals ----------------
  const [goals, setGoals] = useState([
    {
      id: 1,
      employee: "John Doe",
      goal_name: "Learn React",
      description: "Master React in 2 months",
      start_date: "2025-08-01",
      end_date: "2025-09-30",
      status: "In Progress",
    },
  ]);

  // ---------------- Reviews ----------------
  const [reviews, setReviews] = useState([
    {
      id: 1,
      employee: "Jane Smith",
      review_date: "2025-08-15",
      overall_rating: 4,
      comments: "Strong creative ability",
      next_steps: "Take leadership role in new project",
    },
  ]);

  // ---------------- Feedback ----------------
  const [feedbackList, setFeedbackList] = useState([
    {
      id: 1,
      employee: "David Johnson",
      date: "2025-08-14",
      type: "Peer",
      content: "Helped me with client presentation",
      is_appraisal: false,
    },
  ]);

  // ---------------- Shared States ----------------
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalSection, setModalSection] = useState("");
  const [currentItem, setCurrentItem] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  // ---------------- Utils ----------------
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBadgeVariant = (rating) => {
    if (rating >= 80) return "success";
    if (rating >= 60) return "warning";
    return "danger";
  };

  const showToastNotification = (message, variant = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  // ---------------- Handlers ----------------
  const handleOpenModal = (section, type, item = {}) => {
    setModalSection(section);
    setModalType(type);
    setCurrentItem(type === "add" ? {} : item);
    setShowModal(true);
  };

  const handleSave = () => {
    if (modalSection === "overview") {
      if (modalType === "add") {
        setEmployees([...employees, { id: Date.now(), ...currentItem }]);
        showToastNotification("Employee added successfully!");
      } else if (modalType === "edit") {
        setEmployees(
          employees.map((emp) =>
            emp.id === currentItem.id ? currentItem : emp
          )
        );
        showToastNotification("Employee updated successfully!");
      }
    }
    setShowModal(false);
  };

  const handleDelete = (section, id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      if (section === "overview")
        setEmployees(employees.filter((emp) => emp.id !== id));
      if (section === "goals") setGoals(goals.filter((g) => g.id !== id));
      if (section === "reviews")
        setReviews(reviews.filter((r) => r.id !== id));
      if (section === "feedback")
        setFeedbackList(feedbackList.filter((f) => f.id !== id));
      showToastNotification("Deleted successfully!", "danger");
    }
  };

  // ---------------- Render ----------------
  return (
    <div className="d-flex employee-performance">
      <AdminSidebar />
      <Container fluid className="performance-container p-4">
        <Row>
          <Col>
            <Card className="shadow-lg border-0 rounded-3">
              <Card.Header className="bg-gradient text-white py-3">
                <h4 className="mb-0">Employee Performance Management</h4>
              </Card.Header>
              <Card.Body>
                <Tabs defaultActiveKey="overview" className="mb-4 nav-custom">
                  {/* ---------------- Overview ---------------- */}
                  <Tab eventKey="overview" title="Overview">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Search by name or department"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="shadow-sm"
                        style={{ maxWidth: "320px" }}
                      />
                      <Button
                        variant="primary"
                        className="rounded-pill"
                        onClick={() => handleOpenModal("overview", "add")}
                      >
                        <FaPlus /> Add Employee
                      </Button>
                    </div>
                    <Table
                      hover
                      responsive
                      bordered
                      className="align-middle text-center custom-table"
                    >
                      <thead className="table-dark">
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Department</th>
                          <th>Rating</th>
                          <th>Tasks</th>
                          <th>Feedback</th>
                          <th>Progress</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEmployees.map((emp, index) => (
                          <tr key={emp.id}>
                            <td>{index + 1}</td>
                            <td>
                              <strong>{emp.name}</strong>
                            </td>
                            <td>{emp.department}</td>
                            <td>
                              <Badge bg={getBadgeVariant(emp.rating)}>
                                {emp.rating}%
                              </Badge>
                            </td>
                            <td>{emp.tasksCompleted}</td>
                            <td className="text-muted">{emp.feedback}</td>
                            <td>
                              <ProgressBar
                                now={emp.rating}
                                variant={getBadgeVariant(emp.rating)}
                              />
                            </td>
                            <td>
                              <div className="d-flex justify-content-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline-info"
                                  onClick={() =>
                                    handleOpenModal("overview", "view", emp)
                                  }
                                >
                                  <FaEye />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() =>
                                    handleOpenModal("overview", "edit", emp)
                                  }
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() =>
                                    handleDelete("overview", emp.id)
                                  }
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Tab>

                  {/* ---------------- Goals ---------------- */}
                  <Tab eventKey="goals" title="Goals">
                    <div className="d-flex justify-content-end mb-3">
                      <Button
                        variant="primary"
                        className="rounded-pill"
                        onClick={() => handleOpenModal("goals", "add")}
                      >
                        <FaPlus /> Add Goal
                      </Button>
                    </div>
                    <Table
                      hover
                      responsive
                      bordered
                      className="align-middle text-center custom-table"
                    >
                      <thead className="table-dark">
                        <tr>
                          <th>#</th>
                          <th>Employee</th>
                          <th>Goal</th>
                          <th>Description</th>
                          <th>Start</th>
                          <th>End</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {goals.map((g, i) => (
                          <tr key={g.id}>
                            <td>{i + 1}</td>
                            <td>{g.employee}</td>
                            <td>
                              <strong>{g.goal_name}</strong>
                            </td>
                            <td>{g.description}</td>
                            <td>{g.start_date}</td>
                            <td>{g.end_date}</td>
                            <td>
                              <Badge
                                bg={g.status === "Completed" ? "success" : "warning"}
                              >
                                {g.status}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex justify-content-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline-info"
                                  onClick={() =>
                                    handleOpenModal("goals", "view", g)
                                  }
                                >
                                  <FaEye />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() =>
                                    handleOpenModal("goals", "edit", g)
                                  }
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() =>
                                    handleDelete("goals", g.id)
                                  }
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Tab>

                  {/* ---------------- Reviews ---------------- */}
                  <Tab eventKey="reviews" title="Performance Reviews">
                    <div className="d-flex justify-content-end mb-3">
                      <Button
                        variant="primary"
                        className="rounded-pill"
                        onClick={() => handleOpenModal("reviews", "add")}
                      >
                        <FaPlus /> Add Review
                      </Button>
                    </div>
                    <Table
                      hover
                      responsive
                      bordered
                      className="align-middle text-center custom-table"
                    >
                      <thead className="table-dark">
                        <tr>
                          <th>#</th>
                          <th>Employee</th>
                          <th>Date</th>
                          <th>Rating</th>
                          <th>Comments</th>
                          <th>Next Steps</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reviews.map((r, i) => (
                          <tr key={r.id}>
                            <td>{i + 1}</td>
                            <td>{r.employee}</td>
                            <td>{r.review_date}</td>
                            <td>
                              <Badge bg="info">{r.overall_rating} / 5</Badge>
                            </td>
                            <td>{r.comments}</td>
                            <td>{r.next_steps}</td>
                            <td>
                              <div className="d-flex justify-content-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline-info"
                                  onClick={() =>
                                    handleOpenModal("reviews", "view", r)
                                  }
                                >
                                  <FaEye />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() =>
                                    handleOpenModal("reviews", "edit", r)
                                  }
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() =>
                                    handleDelete("reviews", r.id)
                                  }
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Tab>

                  {/* ---------------- Feedback ---------------- */}
                  <Tab eventKey="feedback" title="Feedback">
                    <div className="d-flex justify-content-end mb-3">
                      <Button
                        variant="primary"
                        className="rounded-pill"
                        onClick={() => handleOpenModal("feedback", "add")}
                      >
                        <FaPlus /> Add Feedback
                      </Button>
                    </div>
                    <Table
                      hover
                      responsive
                      bordered
                      className="align-middle text-center custom-table"
                    >
                      <thead className="table-dark">
                        <tr>
                          <th>#</th>
                          <th>Employee</th>
                          <th>Date</th>
                          <th>Type</th>
                          <th>Content</th>
                          <th>Appraisal</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feedbackList.map((f, i) => (
                          <tr key={f.id}>
                            <td>{i + 1}</td>
                            <td>{f.employee}</td>
                            <td>{f.date}</td>
                            <td>
                              <Badge bg="secondary">{f.type}</Badge>
                            </td>
                            <td>{f.content}</td>
                            <td>
                              {f.is_appraisal ? (
                                <Badge bg="success">Yes</Badge>
                              ) : (
                                <Badge bg="danger">No</Badge>
                              )}
                            </td>
                            <td>
                              <div className="d-flex justify-content-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline-info"
                                  onClick={() =>
                                    handleOpenModal("feedback", "view", f)
                                  }
                                >
                                  <FaEye />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() =>
                                    handleOpenModal("feedback", "edit", f)
                                  }
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() =>
                                    handleDelete("feedback", f.id)
                                  }
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>
              {modalType === "add" && `Add ${modalSection}`}
              {modalType === "edit" && `Edit ${modalSection}`}
              {modalType === "view" && `View ${modalSection}`}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalSection === "overview" && modalType !== "view" && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter employee name"
                    value={currentItem.name || ""}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, name: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter department"
                    value={currentItem.department || ""}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        department: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter rating (0-100)"
                    value={currentItem.rating || ""}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        rating: Number(e.target.value),
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tasks Completed</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter tasks completed"
                    value={currentItem.tasksCompleted || ""}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        tasksCompleted: Number(e.target.value),
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Feedback</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter feedback"
                    value={currentItem.feedback || ""}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        feedback: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Form>
            )}

            {modalType === "view" && (
              <div>
                <pre>{JSON.stringify(currentItem, null, 2)}</pre>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            {modalType !== "view" && (
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            )}
          </Modal.Footer>
        </Modal>

        {/* Toast */}
        <ToastContainer position="top-end" className="p-3">
          <Toast
            bg={toastVariant}
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={3000}
            autohide
          >
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </div>
  );
};

export default EmployeePerformance;

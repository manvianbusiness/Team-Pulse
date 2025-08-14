import React, { useState } from "react";
import {
  Container, Row, Col, Card, Table, Form, Button,
  ProgressBar, Badge, Modal, Toast, ToastContainer
} from "react-bootstrap";

const EmployeePerformance = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", department: "Development", rating: 85, tasksCompleted: 48, feedback: "Excellent team player" },
    { id: 2, name: "Jane Smith", department: "Design", rating: 72, tasksCompleted: 35, feedback: "Good creative skills" },
    { id: 3, name: "David Johnson", department: "Marketing", rating: 60, tasksCompleted: 28, feedback: "Needs improvement in communication" },
    { id: 4, name: "Sarah Williams", department: "HR", rating: 90, tasksCompleted: 50, feedback: "Very supportive and proactive" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'view' | 'edit' | 'add'
  const [currentEmployee, setCurrentEmployee] = useState({});

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success"); // success, danger, warning

  // Filter logic
  const filteredEmployees = employees.filter(emp =>
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

  // Open modal for add/edit/view
  const handleOpenModal = (type, emp = {}) => {
    setModalType(type);
    setCurrentEmployee(emp);
    setShowModal(true);
  };

  // Save employee (add/edit)
  const handleSave = () => {
    if (modalType === "add") {
      setEmployees([...employees, { ...currentEmployee, id: Date.now() }]);
      showToastNotification("Employee added successfully!", "success");
    } else if (modalType === "edit") {
      setEmployees(employees.map(emp => emp.id === currentEmployee.id ? currentEmployee : emp));
      showToastNotification("Employee updated successfully!", "info");
    }
    setShowModal(false);
  };

  // Delete employee
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setEmployees(employees.filter(emp => emp.id !== id));
      showToastNotification("Employee deleted successfully!", "danger");
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Employee Performance</h4>
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder="Search by name or department"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="success" onClick={() => handleOpenModal("add")}>+ Add Employee</Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Performance Rating</th>
                    <th>Tasks Completed</th>
                    <th>Feedback</th>
                    <th>Progress</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp, index) => (
                    <tr key={emp.id}>
                      <td>{index + 1}</td>
                      <td>{emp.name}</td>
                      <td>{emp.department}</td>
                      <td>
                        <Badge bg={getBadgeVariant(emp.rating)}>{emp.rating}%</Badge>
                      </td>
                      <td>{emp.tasksCompleted}</td>
                      <td>{emp.feedback}</td>
                      <td>
                        <ProgressBar
                          now={emp.rating}
                          label={`${emp.rating}%`}
                          variant={getBadgeVariant(emp.rating)}
                        />
                      </td>
                      <td>
                        <Button size="sm" variant="info" className="me-2"
                          onClick={() => handleOpenModal("view", emp)}>View</Button>
                        <Button size="sm" variant="primary" className="me-2"
                          onClick={() => handleOpenModal("edit", emp)}>Edit</Button>
                        <Button size="sm" variant="danger"
                          onClick={() => handleDelete(emp.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">
                        No matching employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "add" && "Add Employee"}
            {modalType === "edit" && "Edit Employee"}
            {modalType === "view" && "View Employee"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === "view" ? (
            <>
              <p><strong>Name:</strong> {currentEmployee.name}</p>
              <p><strong>Department:</strong> {currentEmployee.department}</p>
              <p><strong>Rating:</strong> {currentEmployee.rating}%</p>
              <p><strong>Tasks Completed:</strong> {currentEmployee.tasksCompleted}</p>
              <p><strong>Feedback:</strong> {currentEmployee.feedback}</p>
            </>
          ) : (
            <>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={currentEmployee.name || ""}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  type="text"
                  value={currentEmployee.department || ""}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, department: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Performance Rating</Form.Label>
                <Form.Control
                  type="number"
                  value={currentEmployee.rating || ""}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, rating: Number(e.target.value) })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Tasks Completed</Form.Label>
                <Form.Control
                  type="number"
                  value={currentEmployee.tasksCompleted || ""}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, tasksCompleted: Number(e.target.value) })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Feedback</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={currentEmployee.feedback || ""}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, feedback: e.target.value })}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          {modalType !== "view" && (
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Toast Notification */}
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
  );
};

export default EmployeePerformance;

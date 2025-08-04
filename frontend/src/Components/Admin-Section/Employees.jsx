import React, { useState } from 'react';
import {
  Container, Row, Col, Card, Button,
  Pagination, Modal, Form, Badge
} from 'react-bootstrap';
import { FaUserCircle, FaEye, FaEdit, FaTrash, FaPhoneAlt, FaEnvelope, FaBirthdayCake } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import './Employees.css';

const initialEmployees = [
  {
    id: 1,
    name: 'Joe',
    department: 'Development',
    designation: 'Frontend Developer',
    leaveBalance: '12 Days',
    phone: '9876543210',
    email: 'joe@company.com',
    dob: '1990-03-01',
    profilePic: ''
  },
  {
    id: 2,
    name: 'Lisa',
    department: 'HR',
    designation: 'HR Manager',
    leaveBalance: '8 Days',
    phone: '9876543211',
    email: 'lisa@company.com',
    dob: '1988-07-15',
    profilePic: ''
  }
];

const EmployeesList = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 4;

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    department: '',
    designation: '',
    email: '',
    phone: '',
    dob: '',
    leaveBalance: '',
    profilePic: ''
  });

  const indexOfLast = currentPage * employeesPerPage;
  const indexOfFirst = indexOfLast - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(employees.length / employeesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRemove = (id) => {
    const updated = employees.filter(emp => emp.id !== id);
    setEmployees(updated);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewEmployee({ ...newEmployee, profilePic: URL.createObjectURL(file) });
    }
  };

  const handleAddEmployee = () => {
    const newId = employees.length ? employees[employees.length - 1].id + 1 : 1;
    const employeeToAdd = { ...newEmployee, id: newId };
    setEmployees([...employees, employeeToAdd]);
    resetEmployeeForm();
    setShowAddModal(false);
  };

  const handleEdit = (emp) => {
    setNewEmployee(emp);
    setShowEditModal(true);
  };

  const handleUpdateEmployee = () => {
    const updatedEmployees = employees.map(emp =>
      emp.id === newEmployee.id ? newEmployee : emp
    );
    setEmployees(updatedEmployees);
    resetEmployeeForm();
    setShowEditModal(false);
  };

  const resetEmployeeForm = () => {
    setNewEmployee({
      name: '',
      department: '',
      designation: '',
      email: '',
      phone: '',
      dob: '',
      leaveBalance: '',
      profilePic: ''
    });
  };

  return (
    <div className="d-flex">
      <AdminSidebar />
      <Container className="employee-container mt-5">
        <Row>
          <Col lg={12} className="mb-4 d-flex justify-content-between align-items-center">
            <h4>👥 Employees</h4>
            <Button  className="rounded-pill px-4" onClick={() => setShowAddModal(true)}>
              + Add Employee
            </Button>
          </Col>

          {currentEmployees.map(emp => (
            <Col md={6} lg={4} className="mb-4" key={emp.id}>
              <Card className="shadow-lg border-0 rounded-4">
                <Card.Body className="text-center">
                  {emp.profilePic ? (
                    <img src={emp.profilePic} alt="Profile" className="rounded-circle mb-3" width="100" height="100" />
                  ) : (
                    <FaUserCircle className="text-secondary mb-3" size={80} />
                  )}
                  <Card.Title className="fw-bold">{emp.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{emp.designation}</Card.Subtitle>
                  <Badge bg="info" className="mb-2">{emp.department}</Badge>
                  <p className="mb-1"><FaEnvelope className="me-2 text-primary" /> {emp.email}</p>
                  <p className="mb-1"><FaPhoneAlt className="me-2 text-success" /> {emp.phone}</p>
                  <p className="mb-1"><FaBirthdayCake className="me-2 text-danger" /> {emp.dob}</p>
                  <p><Badge>{emp.leaveBalance}</Badge></p>

                  <div className="d-flex justify-content-center gap-3 mt-2">
                    <Button variant="outline-info" size="sm" onClick={() => { setSelectedEmployee(emp); setShowViewModal(true); }}>
                      <FaEye />
                    </Button>
                    <Button variant="outline-warning" size="sm" onClick={() => handleEdit(emp)}>
                      <FaEdit />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleRemove(emp.id)}>
                      <FaTrash />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="justify-content-center mt-3">
          <Pagination>
            {[...Array(totalPages).keys()].map(num => (
              <Pagination.Item
                key={num + 1}
                active={num + 1 === currentPage}
                onClick={() => handlePageChange(num + 1)}
              >
                {num + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Row>
      </Container>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Employee Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedEmployee ? (
            <>
              {selectedEmployee.profilePic ? (
                <img src={selectedEmployee.profilePic} alt="Profile" className="rounded-circle mb-3" width="100" height="100" />
              ) : (
                <FaUserCircle className="text-secondary mb-3" size={80} />
              )}
              <p><strong>Name:</strong> {selectedEmployee.name}</p>
              <p><strong>Department:</strong> {selectedEmployee.department}</p>
              <p><strong>Designation:</strong> {selectedEmployee.designation}</p>
              <p><strong>Email:</strong> {selectedEmployee.email}</p>
              <p><strong>Phone:</strong> {selectedEmployee.phone}</p>
              <p><strong>DOB:</strong> {selectedEmployee.dob}</p>
              <p><strong>Leave Balance:</strong> {selectedEmployee.leaveBalance}</p>
            </>
          ) : (
            <p>No employee selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Add/Edit Modal */}
      <Modal show={showAddModal || showEditModal} onHide={() => { setShowAddModal(false); setShowEditModal(false); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>{showAddModal ? 'Add New' : 'Edit'} Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
            </Form.Group>
            {['name', 'department', 'designation', 'email', 'dob', 'leaveBalance'].map(field => (
              <Form.Group className="mb-3" controlId={`form-${field}`} key={field}>
                <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                <Form.Control
                  type={field === 'dob' ? 'date' : 'text'}
                  placeholder={`Enter ${field}`}
                  value={newEmployee[field]}
                  onChange={(e) => setNewEmployee({ ...newEmployee, [field]: e.target.value })}
                />
              </Form.Group>
            ))}
            <Form.Group className="mb-3" controlId="form-phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                pattern="[0-9]*"
                maxLength={10}
                value={newEmployee.phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setNewEmployee({ ...newEmployee, phone: value });
                  }
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={showAddModal ? handleAddEmployee : handleUpdateEmployee}
          >
            {showAddModal ? 'Add Employee' : 'Update Employee'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeesList;

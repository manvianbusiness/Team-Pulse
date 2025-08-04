import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Card,
} from 'react-bootstrap';
import AdminSidebar from './AdminSidebar';
import './Attendance.css'; // Import brand guideline styles

const dummyAttendanceData = [
  {
    id: 1,
    name: 'John Doe',
    department: 'HR',
    date: '2024-07-31',
    clockInStatus: 'Present',
  },
  {
    id: 2,
    name: 'Jane Smith',
    department: 'IT',
    date: '2024-07-30',
    clockInStatus: 'Absent',
  },
  {
    id: 3,
    name: 'Mark Taylor',
    department: 'Sales',
    date: '2024-07-31',
    clockInStatus: 'Present',
  },
  {
    id: 4,
    name: 'Sara Lee',
    department: 'HR',
    date: '2024-07-30',
    clockInStatus: 'Present',
  },
];

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [filteredData, setFilteredData] = useState(dummyAttendanceData);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDeptChange = (e) => {
    setSelectedDept(e.target.value);
  };

  useEffect(() => {
    let filtered = dummyAttendanceData;

    if (selectedDate) {
      filtered = filtered.filter((item) => item.date === selectedDate);
    }

    if (selectedDept) {
      filtered = filtered.filter((item) => item.department === selectedDept);
    }

    setFilteredData(filtered);
  }, [selectedDate, selectedDept]);

  const handleViewAll = () => {
    setSelectedDate('');
    setSelectedDept('');
    setFilteredData(dummyAttendanceData);
  };

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="attendance-container">
        <Container fluid>
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </Col>
            <Col md={3}>
              <Form.Select value={selectedDept} onChange={handleDeptChange}>
                <option value="">All Departments</option>
                <option value="HR">HR</option>
                <option value="IT">IT</option>
                <option value="Sales">Sales</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button variant="info" onClick={handleViewAll}>
                View All
              </Button>
            </Col>
          </Row>

          <Card>
            <Card.Body>
              <h5 className="attendance-heading">
                Attendance{' '}
                {selectedDate
                  ? `on ${selectedDate}`
                  : selectedDept
                  ? `for ${selectedDept} Department`
                  : 'Records'}
              </h5>
              <Table striped bordered hover responsive className="mt-3">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Employee Name</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Clock-in Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((record, index) => (
                      <tr key={record.id}>
                        <td>{index + 1}</td>
                        <td>{record.name}</td>
                        <td>{record.department}</td>
                        <td>{record.date}</td>
                        <td>{record.clockInStatus}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default Attendance;

import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  ProgressBar,
} from "react-bootstrap";
import {
  FaDownload,
  FaFileInvoiceDollar,
  FaHistory,
  FaUserTie,
  FaFileAlt,
} from "react-icons/fa";
import EmployeeSidebar from "./EmployeeSidebar";

const EmployeePayrollDashboard = () => {
  const [payslips] = useState([
    { id: 1, month: "July 2025", pdf: "/payslips/july-2025.pdf" },
    { id: 2, month: "June 2025", pdf: "/payslips/june-2025.pdf" },
    { id: 3, month: "May 2025", pdf: "/payslips/may-2025.pdf" },
  ]);

  const [salaryHistory] = useState([
    { id: 1, date: "31-July-2025", amount: "₹55,000", status: "Paid" },
    { id: 2, date: "30-June-2025", amount: "₹55,000", status: "Paid" },
    { id: 3, date: "31-May-2025", amount: "₹55,000", status: "Paid" },
  ]);

  const [profile] = useState({
    name: "Akshaya R.",
    designation: "Software Engineer",
    employeeId: "EMP1025",
    department: "Development",
    joiningDate: "01-Jan-2023",
  });

  return (
    <div className="d-flex" style={{ minHeight: "100vh", overflowX: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", flexShrink: 0 }}>
        <EmployeeSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-3">
        <Container fluid>
          <Row>
            {/* Profile Section */}
            <Col md={12} className="mb-4">
              <Card className="shadow-lg border-0 rounded-4">
                <Card.Body className="d-flex flex-column flex-md-row align-items-center justify-content-between p-4 bg-gradient bg-light">
                  <div>
                    <h3 className="fw-bold mb-1">
                      <FaUserTie className="me-2 text-primary" />
                      {profile.name}
                    </h3>
                    <p className="mb-1 text-muted">{profile.designation}</p>
                    <small className="text-secondary">
                      Employee ID: {profile.employeeId}
                    </small>
                  </div>
                  <div className="text-end">
                    <Badge bg="info" className="me-2 fs-6">
                      {profile.department}
                    </Badge>
                    <Badge bg="success" className="fs-6">
                      Joined: {profile.joiningDate}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Payslips Section */}
            <Col md={6} className="mb-4">
              <Card className="shadow border-0 rounded-4">
                <Card.Header className="bg-primary text-white fw-bold rounded-top-4 d-flex align-items-center">
                  <FaFileAlt className="me-2" /> Payslips
                </Card.Header>
                <Card.Body>
                  <Table
                    striped
                    bordered
                    hover
                    responsive
                    className="align-middle text-center"
                  >
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Month</th>
                        <th>Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payslips.map((payslip, index) => (
                        <tr key={payslip.id}>
                          <td>{index + 1}</td>
                          <td>{payslip.month}</td>
                          <td>
                            <Button
                              variant="outline-success"
                              size="sm"
                              href={payslip.pdf}
                              target="_blank"
                              download
                            >
                              <FaDownload className="me-1" /> Download
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>

            {/* Salary History Section */}
            <Col md={6} className="mb-4">
              <Card className="shadow border-0 rounded-4">
                <Card.Header className="bg-secondary text-white fw-bold rounded-top-4 d-flex align-items-center">
                  <FaHistory className="me-2" /> Salary History
                </Card.Header>
                <Card.Body>
                  <Table
                    striped
                    bordered
                    hover
                    responsive
                    className="align-middle text-center"
                  >
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salaryHistory.map((salary, index) => (
                        <tr key={salary.id}>
                          <td>{index + 1}</td>
                          <td>{salary.date}</td>
                          <td>{salary.amount}</td>
                          <td>
                            <Badge bg="success" className="px-3 py-2">
                              {salary.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {/* Salary Progress Example */}
                  <div className="mt-3">
                    <p className="fw-bold mb-1">Annual Salary Progress</p>
                    <ProgressBar now={70} label="70%" variant="success" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Tax & Deductions Section */}
          <Row>
            <Col md={12}>
              <Card className="shadow border-0 rounded-4">
                <Card.Header className="bg-dark text-white fw-bold rounded-top-4 d-flex align-items-center">
                  <FaFileInvoiceDollar className="me-2" /> Tax & Deductions
                </Card.Header>
                <Card.Body>
                  <Table
                    bordered
                    hover
                    responsive
                    className="align-middle text-center"
                  >
                    <thead className="table-light">
                      <tr>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Month</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Provident Fund (PF)</td>
                        <td>₹3,000</td>
                        <td>July 2025</td>
                      </tr>
                      <tr>
                        <td>Professional Tax</td>
                        <td>₹200</td>
                        <td>July 2025</td>
                      </tr>
                      <tr>
                        <td>Income Tax (TDS)</td>
                        <td>₹2,500</td>
                        <td>July 2025</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default EmployeePayrollDashboard;

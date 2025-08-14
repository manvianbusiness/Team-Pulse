// MonthlyPerformanceReport.jsx
import React, { useState, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Table,
  Button,
  ProgressBar,
} from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { FaSave, FaFileCsv, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import AdminSidebar from "./AdminSidebar";
import "./Performance.css";

// Sample employee monthly data
const sampleEmployees = [
  { id: 1, name: "Alice", department: "HR", shift: "Day", performance: 85 },
  { id: 2, name: "Bob", department: "IT", shift: "Night", performance: 70 },
  { id: 3, name: "Charlie", department: "Finance", shift: "Day", performance: 90 },
  { id: 4, name: "David", department: "IT", shift: "Day", performance: 60 },
];

const MonthlyPerformanceReport = () => {
  const [employees, setEmployees] = useState(sampleEmployees);
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState("2025");
  const [department, setDepartment] = useState("All");
  const [shift, setShift] = useState("All");

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      return (
        (department === "All" || emp.department === department) &&
        (shift === "All" || emp.shift === shift)
      );
    });
  }, [department, shift, employees]);

  const getProgressVariant = (value) => {
    if (value >= 85) return "success";
    if (value >= 60) return "info";
    if (value >= 40) return "warning";
    return "danger";
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredEmployees);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MonthlyReport");
    XLSX.writeFile(workbook, `MonthlyPerformance_${month}-${year}.xlsx`);
  };

  const handleExportCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredEmployees);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `MonthlyPerformance_${month}-${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const averagePerformance =
    filteredEmployees.reduce((sum, emp) => sum + emp.performance, 0) /
    filteredEmployees.length || 0;

  return (
    <div className="performance-container">
      <AdminSidebar />
      <Container fluid className="p-4">
        <h2 className="mb-4">Monthly Performance Report</h2>

        <Card className="mb-4 shadow-sm p-3 rounded">
          <Row className="align-items-center">
            <Col md={2} className="mb-2">
              <Form.Select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="01">Jan</option>
                <option value="02">Feb</option>
                <option value="03">Mar</option>
                <option value="04">Apr</option>
                <option value="05">May</option>
                <option value="06">Jun</option>
                <option value="07">Jul</option>
                <option value="08">Aug</option>
                <option value="09">Sep</option>
                <option value="10">Oct</option>
                <option value="11">Nov</option>
                <option value="12">Dec</option>
              </Form.Select>
            </Col>
            <Col md={2} className="mb-2">
              <Form.Control
                type="number"
                min="2020"
                max="2030"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </Col>
            <Col md={2} className="mb-2">
              <Form.Select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="All">All Departments</option>
                <option value="HR">HR</option>
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
              </Form.Select>
            </Col>
            <Col md={2} className="mb-2">
              <Form.Select value={shift} onChange={(e) => setShift(e.target.value)}>
                <option value="All">All Shifts</option>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
              </Form.Select>
            </Col>
            <Col md={2} className="mb-2">
              <Button variant="success" className="w-100" onClick={handleExportExcel}>
                <FaFileExcel /> Excel
              </Button>
            </Col>
            <Col md={2} className="mb-2">
              <Button variant="info" className="w-100" onClick={handleExportCSV}>
                <FaFileCsv /> CSV
              </Button>
            </Col>
          </Row>
        </Card>

        <Row>
          <Col md={8}>
            <Card className="p-3 mb-4 shadow-sm rounded">
              <h5 className="mb-3">Employee Performance Table</h5>
              <Table striped bordered hover responsive className="align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Shift</th>
                    <th>Performance (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id}>
                      <td>{emp.id}</td>
                      <td>{emp.name}</td>
                      <td>{emp.department}</td>
                      <td>{emp.shift}</td>
                      <td>
                        <ProgressBar
                          now={emp.performance}
                          label={`${emp.performance}%`}
                          variant={getProgressVariant(emp.performance)}
                          animated
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <p>
                <strong>Average Performance: </strong>
                {averagePerformance.toFixed(2)}%
              </p>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="p-3 mb-4 shadow-sm rounded">
              <h5 className="mb-3">Performance Overview</h5>
              <BarChart width={300} height={250} data={filteredEmployees}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="performance" fill="#0d6efd" />
              </BarChart>
            </Card>

            <Card className="p-3 shadow-sm rounded">
              <h5 className="mb-3">Performance Trend</h5>
              <LineChart width={300} height={250} data={filteredEmployees}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="performance" stroke="#28a745" />
              </LineChart>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MonthlyPerformanceReport;



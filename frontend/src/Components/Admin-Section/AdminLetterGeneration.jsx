import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  ListGroup,
  InputGroup,
  Collapse,
} from "react-bootstrap";
import jsPDF from "jspdf";
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminSidebar from "./AdminSidebar"


function AdminLetterGeneration() {
  const [employee, setEmployee] = useState({ name: "", designation: "", doj: "" });
  const [letterType, setLetterType] = useState("offer");
  const [letter, setLetter] = useState("");
  const [history, setHistory] = useState([]);
  const [logo, setLogo] = useState(null);
  const [signature, setSignature] = useState(null);
  const [search, setSearch] = useState("");
  const [customTemplate, setCustomTemplate] = useState("");
  const [openHistory, setOpenHistory] = useState({});

  const templates = {
    offer: `
Dear {EmployeeName},

Congratulations! We are pleased to offer you the position of {Designation} with us.
Your joining date will be {DOJ}.

Welcome aboard!
Regards,
HR Department
    `,
    appointment: `
Dear {EmployeeName},

This is to confirm your appointment as {Designation} effective {DOJ}.
We are excited to have you join our team.

Best wishes,
HR Department
    `,
    relieving: `
Dear {EmployeeName},

This letter confirms that you have been relieved from your duties as {Designation} effective {DOJ}.
We thank you for your contributions to the company.

Sincerely,
HR Department
    `,
  };

  const getTemplate = () =>
    letterType === "custom" && customTemplate.trim() ? customTemplate : templates[letterType];

  const generateLetter = () => {
    const filled = getTemplate()
      .replace("{EmployeeName}", employee.name || "________")
      .replace("{Designation}", employee.designation || "________")
      .replace("{DOJ}", employee.doj || "________");

    setLetter(filled);
    setHistory([...history, { id: Date.now(), type: letterType, content: filled, name: employee.name }]);
  };

  const resetForm = () => {
    setEmployee({ name: "", designation: "", doj: "" });
    setLetter("");
    setLetterType("offer");
    setCustomTemplate("");
  };

  const downloadPDF = () => {
    if (!letter) return;
    const doc = new jsPDF();
    doc.setFont("times", "normal");
    doc.setFontSize(12);

    if (logo) doc.addImage(logo, "PNG", 150, 10, 40, 20);
    doc.text(letter, 20, 40, { maxWidth: 170 });
    if (signature) doc.addImage(signature, "PNG", 20, 250, 50, 20);
    doc.save(`${employee.name || "Letter"}.pdf`);
  };

  const handleImageUpload = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setter(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const filteredHistory = history.filter(
    (h) => h.name.toLowerCase().includes(search.toLowerCase()) || h.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <AdminSidebar />
    <Container className="mt-5" style={{ fontFamily: "'Montserrat', sans-serif", color: "#202020" }}>
      <Card className="p-4 shadow-lg border-0 rounded-4" style={{ backgroundColor: "#FFFFFF" }}>
        <h3 className="mb-4 text-center" style={{ color: "#19BDE8" }}>Admin - Letter Generation</h3>

        <Row>
          {/* FORM */}
          <Col md={6}>
            <Card className="p-3 shadow-sm mb-4 rounded-4" style={{ borderColor: "#19BDE8" }}>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#202020", fontWeight: 500 }}>Employee Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={employee.name}
                    onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
                    placeholder="Enter employee name"
                    style={{ borderColor: "#19BDE8" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#202020", fontWeight: 500 }}>Designation</Form.Label>
                  <Form.Control
                    type="text"
                    value={employee.designation}
                    onChange={(e) => setEmployee({ ...employee, designation: e.target.value })}
                    placeholder="Enter designation"
                    style={{ borderColor: "#19BDE8" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#202020", fontWeight: 500 }}>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={employee.doj}
                    onChange={(e) => setEmployee({ ...employee, doj: e.target.value })}
                    style={{ borderColor: "#19BDE8" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#202020", fontWeight: 500 }}>Letter Type</Form.Label>
                  <Form.Select
                    value={letterType}
                    onChange={(e) => setLetterType(e.target.value)}
                    style={{ borderColor: "#19BDE8" }}
                  >
                    <option value="offer">Offer Letter</option>
                    <option value="appointment">Appointment Letter</option>
                    <option value="relieving">Relieving Letter</option>
                    <option value="custom">Custom Template</option>
                  </Form.Select>
                </Form.Group>

                {letterType === "custom" && (
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: "#202020", fontWeight: 500 }}>Custom Template</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      value={customTemplate}
                      onChange={(e) => setCustomTemplate(e.target.value)}
                      placeholder="Use {EmployeeName}, {Designation}, {DOJ}"
                      style={{ borderColor: "#19BDE8" }}
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#202020", fontWeight: 500 }}>Upload Company Logo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setLogo)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#202020", fontWeight: 500 }}>Upload Digital Signature</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setSignature)}
                  />
                </Form.Group>

                <div className="d-flex gap-2 mt-3">
                  <Button
                    className="flex-grow-1"
                    style={{ backgroundColor: "#19BDE8", borderColor: "#19BDE8" }}
                    onClick={generateLetter}
                  >
                    Generate Letter
                  </Button>
                  <Button
                    variant="outline-dark"
                    className="flex-grow-1"
                    style={{ borderColor: "#19BDE8", color: "#202020" }}
                    onClick={resetForm}
                  >
                    Reset
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>

          {/* LETTER PREVIEW */}
          <Col md={6}>
            {letter && (
              <Card className="p-3 shadow-sm mb-4 rounded-4" style={{ backgroundColor: "#F9F9F9", borderColor: "#19BDE8" }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 style={{ color: "#19BDE8" }}>Generated Letter</h5>
                  <Button style={{ backgroundColor: "#19BDE8", borderColor: "#19BDE8" }} size="sm" onClick={downloadPDF}>
                    Download PDF
                  </Button>
                </div>
                {logo && <img src={logo} alt="logo" style={{ width: "100px", float: "right" }} />}
                <pre style={{ whiteSpace: "pre-wrap", padding: "15px", borderRadius: "8px", background: "#FFFFFF", color: "#202020", border: "1px solid #19BDE8" }}>
                  {letter}
                </pre>
                {signature && <img src={signature} alt="signature" style={{ width: "120px", marginTop: "10px" }} />}
              </Card>
            )}
          </Col>
        </Row>

        {/* HISTORY */}
        {history.length > 0 && (
          <Card className="mt-4 p-3 shadow-sm rounded-4" style={{ borderColor: "#19BDE8" }}>
            <h5 style={{ color: "#19BDE8" }} className="mb-3">Letter History</h5>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Search by name or letter type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ borderColor: "#19BDE8" }}
              />
            </InputGroup>
            <ListGroup>
              {filteredHistory.map((item) => (
                <ListGroup.Item
                  key={item.id}
                  action
                  onClick={() => setOpenHistory({ ...openHistory, [item.id]: !openHistory[item.id] })}
                  className="mb-2 shadow-sm rounded-3"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>{item.type.toUpperCase()} Letter</strong>
                    <span>{item.name}</span>
                  </div>
                  <Collapse in={openHistory[item.id]}>
                    <pre style={{ whiteSpace: "pre-wrap", marginTop: "8px", color: "#202020" }}>{item.content}</pre>
                  </Collapse>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        )}
      </Card>
    </Container>
     </div>
  );
}

export default AdminLetterGeneration;

import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  ListGroup,
  Alert,
} from 'react-bootstrap';
import { Megaphone, Send, CheckCircle } from 'react-bootstrap-icons';
import AdminSidebar from './AdminSidebar';
import './AdminBroadcast.css'; // 👈 Add custom styles here

const AdminBroadcast = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('announcements')) || [];
    setAnnouncements(stored);
  }, []);

  const handleSend = () => {
    if (title && message) {
      const newAnnouncement = {
        id: Date.now(),
        title,
        message,
        time: new Date().toLocaleString(),
      };

      const updated = [newAnnouncement, ...announcements];
      setAnnouncements(updated);
      localStorage.setItem('announcements', JSON.stringify(updated));

      setTitle('');
      setMessage('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="d-flex admin-broadcast-wrapper">
      <AdminSidebar />

      <Container fluid className="p-4 main-content">
        <h3 className="mb-4 text-brand d-flex align-items-center">
          <Megaphone className="me-2" /> Broadcast Announcements
        </h3>
        <Row>
          <Col md={6}>
            <Card className="mb-4 card-custom">
              <Card.Header className="card-header-brand">
                <strong>📢 Send New Announcement</strong>
              </Card.Header>
              <Card.Body>
                {success && (
                  <Alert variant="success" className="d-flex align-items-center">
                    <CheckCircle className="me-2" /> Message sent successfully!
                  </Alert>
                )}
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter message title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="form-control-custom"
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Enter announcement message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="form-control-custom"
                    />
                  </Form.Group>
                  <div className="d-grid">
                    <Button variant="primary" size="lg" onClick={handleSend} className="btn-brand">
                      <Send className="me-2" /> Send to Team
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="mb-4 card-custom">
              <Card.Header className="card-header-dark">
                <strong>📬 Sent Announcements</strong>
              </Card.Header>
              <ListGroup variant="flush">
                {announcements.length === 0 ? (
                  <ListGroup.Item className="text-muted text-center py-4">
                    No announcements yet.
                  </ListGroup.Item>
                ) : (
                  announcements.map((msg) => (
                    <ListGroup.Item
                      key={msg.id}
                      className="border-start border-4 border-info"
                    >
                      <h6 className="fw-bold mb-1">{msg.title}</h6>
                      <p className="mb-1">{msg.message}</p>
                      <small className="text-muted">Sent at: {msg.time}</small>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminBroadcast;

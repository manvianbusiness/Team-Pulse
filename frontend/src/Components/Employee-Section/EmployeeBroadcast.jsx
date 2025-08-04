import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
} from 'react-bootstrap';
import { Megaphone } from 'react-bootstrap-icons';
import EmployeeSidebar from './EmployeeSidebar';
import './EmployeeBroadcast.css';

const EmployeeBroadcast = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('announcements')) || [];

      if (stored.length > 0) {
        setAnnouncements(stored);

        // Remove announcements immediately after loading them (so it's seen only once)
        localStorage.removeItem('announcements');
      }
    } catch (err) {
      console.error("Failed to load announcements", err);
      setAnnouncements([]);
    }
  }, []);

  return (
    <div className="d-flex employee-broadcast-wrapper">
      <EmployeeSidebar />

      <Container fluid className="p-4 main-content">
        <h3 className="mb-4 text-primary d-flex align-items-center">
          <Megaphone className="me-2" /> Team Announcements
        </h3>

        <Row>
          <Col md={8}>
            <Card className="mb-4">
              <Card.Header className="bg-primary text-white">
                <strong>📬 Latest Announcements</strong>
              </Card.Header>
              <ListGroup variant="flush">
                {announcements.length === 0 ? (
                  <ListGroup.Item className="text-muted text-center py-4">
                    No announcements available.
                  </ListGroup.Item>
                ) : (
                  announcements.map((msg) => (
                    <ListGroup.Item
                      key={msg.id}
                      className="border-start border-4 border-primary"
                    >
                      <h6 className="fw-bold mb-1">{msg?.title || 'No Title'}</h6>
                      <p className="mb-1">{msg?.message || 'No Message'}</p>
                      <small className="text-muted">Sent at: {msg?.time || 'Unknown time'}</small>
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

export default EmployeeBroadcast;

import React from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import './LeavePolicies.css'; // Make sure this path is correct

const LeavePolicies = () => {
  return (
    <div className="leave-policy-wrapper py-4">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="leave-policy-card p-4">
              <Card.Body>
                <Card.Title className="text-center mb-4" style={{ color: '#19BDE8', fontWeight: 'bold' }}>
                  Leave Policies
                </Card.Title>
                <ListGroup className="leave-policy-list">
                  <ListGroup.Item className="leave-policy-item">
                    <i className="leave-icon bi bi-dot"></i> Employees are entitled to 20 days of paid leave per year.
                  </ListGroup.Item>
                  <ListGroup.Item className="leave-policy-item">
                    <i className="leave-icon bi bi-dot"></i> Leaves must be approved by the reporting manager in advance.
                  </ListGroup.Item>
                  <ListGroup.Item className="leave-policy-item">
                    <i className="leave-icon bi bi-dot"></i> Unused leaves can be carried forward for a maximum of 30 days.
                  </ListGroup.Item>
                  <ListGroup.Item className="leave-policy-item">
                    <i className="leave-icon bi bi-dot"></i> Sick leave requires a medical certificate if more than 2 days.
                  </ListGroup.Item>
                  <ListGroup.Item className="leave-policy-item">
                    <i className="leave-icon bi bi-dot"></i> Emergency leave can be availed with same-day notification.
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LeavePolicies;

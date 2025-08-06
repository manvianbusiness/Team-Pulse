import React, { useEffect, useState } from 'react';
import { Container, Card, ListGroup, Spinner, Alert } from 'react-bootstrap';

const LeavePolicies = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/leave_types");
        const data = await response.json();

        if (response.ok) {
          setLeaveTypes(data.leave_types || []);
        } else {
          setError(data.message || "Failed to load leave types");
        }
      } catch (err) {
        setError("Unable to connect to backend");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveTypes();
  }, []);

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>Leave Policies</Card.Title>

          {loading && <Spinner animation="border" />}
          {error && <Alert variant="danger">{error}</Alert>}
          {!loading && !error && leaveTypes.length === 0 && (
            <Alert variant="info">No leave types found.</Alert>
          )}

          <ListGroup>
            {leaveTypes.map((leave, index) => (
              <ListGroup.Item key={index}>
                <strong>{leave.name}</strong> - {leave.description} ({leave.max_days_per_year} days/year)
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LeavePolicies;

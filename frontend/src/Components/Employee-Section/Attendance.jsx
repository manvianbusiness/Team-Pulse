import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import EmployeeSidebar from './EmployeeSidebar';
import './Attendance.css';

const Attendance = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);

  const [attendanceData, setAttendanceData] = useState([
    {
      date: '2025-07-28',
      status: 'Present',
      checkIn: '09:00 AM',
      checkOut: '05:30 PM',
    },
    {
      date: '2025-07-27',
      status: 'Absent',
      checkIn: '-',
      checkOut: '-',
    },
    {
      date: '2025-07-26',
      status: 'Leave',
      checkIn: '-',
      checkOut: '-',
    },
  ]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleClockIn = () => {
    const now = new Date();
    setIsClockedIn(true);
    setCheckInTime(now);
  };

  const handleClockOut = () => {
    const now = new Date();
    setIsClockedIn(false);
    setCheckOutTime(now);

    const today = formatDate(now);

    const newEntry = {
      date: today,
      status: 'Present',
      checkIn: formatTime(checkInTime),
      checkOut: formatTime(now),
    };

    setAttendanceData([newEntry, ...attendanceData]);
    setCheckInTime(null);
    setCheckOutTime(null);
  };

  // Auto Clock Out after 6 PM or Auto Mark Absent
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const today = formatDate(now);

      if (isClockedIn && currentHour >= 18) {
        const defaultCheckout = new Date();
        defaultCheckout.setHours(18, 0, 0);

        const autoOutEntry = {
          date: today,
          status: 'Present',
          checkIn: checkInTime ? formatTime(checkInTime) : '-',
          checkOut: formatTime(defaultCheckout),
        };

        setAttendanceData((prevData) => {
          const alreadyMarked = prevData.some((entry) => entry.date === today);
          return alreadyMarked ? prevData : [autoOutEntry, ...prevData];
        });

        setIsClockedIn(false);
        setCheckInTime(null);
        setCheckOutTime(defaultCheckout);
      }

      if (!isClockedIn && !checkInTime && currentHour >= 18) {
        const isAlreadyMarked = attendanceData.some((entry) => entry.date === today);
        if (!isAlreadyMarked) {
          const absentEntry = {
            date: today,
            status: 'Absent',
            checkIn: '-',
            checkOut: '-',
          };
          setAttendanceData([absentEntry, ...attendanceData]);
        }
      }
    }, 60000); // check every 1 minute

    return () => clearInterval(interval);
  }, [isClockedIn, checkInTime, attendanceData]);

  // Summary Counts
  const presentDays = attendanceData.filter((entry) => entry.status === 'Present').length;
  const absentDays = attendanceData.filter((entry) => entry.status === 'Absent').length;
  const leaveDays = attendanceData.filter((entry) => entry.status === 'Leave').length;
  const totalWorkingDays = attendanceData.length;

  return (
    <div className="d-flex">
      <EmployeeSidebar />
      <div className="attendance-content flex-grow-1 p-4">
        <h2 className="mb-4 text-primary">Attendance Overview</h2>

        {/* Clock In/Out Controls */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            {checkInTime && !checkOutTime && isClockedIn && (
              <h5 className="text-success">🟢 Clocked In at {formatTime(checkInTime)}</h5>
            )}
            {checkInTime && checkOutTime && !isClockedIn && (
              <h5 className="text-secondary">
                ✅ Clocked In at {formatTime(checkInTime)} | Clocked Out at {formatTime(checkOutTime)}
              </h5>
            )}
            {!checkInTime && !isClockedIn && (
              <h5 className="text-danger">🔴 Not Clocked In</h5>
            )}
          </div>
          <div>
            {!isClockedIn ? (
              <Button variant="success" onClick={handleClockIn}>Clock In</Button>
            ) : (
              <Button variant="danger" onClick={handleClockOut}>Clock Out</Button>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="summary-card present">
              <Card.Body>
                <Card.Title>Present</Card.Title>
                <h3>{presentDays} Days</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="summary-card absent">
              <Card.Body>
                <Card.Title>Absent</Card.Title>
                <h3>{absentDays} Days</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="summary-card leave">
              <Card.Body>
                <Card.Title>Leave</Card.Title>
                <h3>{leaveDays} Days</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="summary-card total">
              <Card.Body>
                <Card.Title>Total Working Days</Card.Title>
                <h3>{totalWorkingDays} Days</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Attendance Table */}
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white">Recent Attendance</Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record, index) => (
                  <tr key={index}>
                    <td>{record.date}</td>
                    <td>
                      <span className={`badge ${
                        record.status === 'Present' ? 'bg-success' :
                        record.status === 'Absent' ? 'bg-danger' :
                        'bg-warning text-dark'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td>{record.checkIn}</td>
                    <td>{record.checkOut}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Attendance;

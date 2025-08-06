import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Image, Form } from 'react-bootstrap';
import EmployeeSidebar from './EmployeeSidebar';
import "./EmployeeProfile.css";

const EmployeeProfile = () => {
  const initialData = {
    profileImage: '',
    name: 'Meera',
    dob: '1997-06-12',
    gender: 'Female',
    email: 'meera.r@example.com',
    phone: '9876543210',
    address: '25th Cross Street',
    city: 'Adyar',
    state: 'Tamil Nadu',
    zip: '600020',
    emergencyContactName: 'Rathinam',
    emergencyContactPhone: '9876501234',
    maritalStatus: 'Single',
    education: 'B.Sc Computer Science - Dr. MGR Janaki College',
    team: 'Frontend Development',
    designation: 'React Developer',
    reportingManager: 'Mr. Suresh Kumar',
    dateOfJoining: '2023-04-10'
  };

  const [formData, setFormData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className='d-flex'>
      <EmployeeSidebar />
      <Container className="py-4">
        <h2 className="mb-4 text-primary">Employee Profile</h2>

        <Card className="border-success">
          <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
            <span>{isEditing ? 'Edit Profile' : 'Saved Profile'}</span>
            {isEditing ? (
              <Button variant="success" size="sm" onClick={handleSave}>Save</Button>
            ) : (
              <Button variant="warning" size="sm" onClick={handleEdit}>Edit</Button>
            )}
          </Card.Header>

          <Card.Body>
            <Row>
              <Col md={3} className="text-center">
                <Image
                  src={formData.profileImage || "https://via.placeholder.com/150"}
                  roundedCircle
                  width={150}
                  height={150}
                  className="mb-2"
                />
                {isEditing && (
                  <Form.Group controlId="formFile" className="mt-2">
                    <Form.Control type="file" onChange={handleImageChange} />
                  </Form.Group>
                )}
              </Col>

              <Col md={9}>
                <h5 className="mb-3">Personal Info</h5>
                {isEditing ? (
                  <>
                    <Form.Group className="mb-2">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Marital Status</Form.Label>
                      <Form.Select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                      >
                        <option>Single</option>
                        <option>Married</option>
                      </Form.Select>
                    </Form.Group>
                  </>
                ) : (
                  <>
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>DOB:</strong> {formData.dob}</p>
                    <p><strong>Gender:</strong> {formData.gender}</p>
                    <p><strong>Marital Status:</strong> {formData.maritalStatus}</p>
                  </>
                )}

                <h5 className="mt-4 mb-3">Contact Info</h5>
                {isEditing ? (
                  <>
                    <Form.Group className="mb-2">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </>
                ) : (
                  <>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                  </>
                )}

                <h5 className="mt-4 mb-3">Address</h5>
                {isEditing ? (
                  <>
                    <Form.Group className="mb-2">
                      <Form.Label>Street</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Zip</Form.Label>
                      <Form.Control
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </>
                ) : (
                  <>
                    <p><strong>Street:</strong> {formData.address}</p>
                    <p><strong>City:</strong> {formData.city}</p>
                    <p><strong>State:</strong> {formData.state}</p>
                    <p><strong>Zip:</strong> {formData.zip}</p>
                  </>
                )}

                <h5 className="mt-4 mb-3">Emergency Contact</h5>
                {isEditing ? (
                  <>
                    <Form.Group className="mb-2">
                      <Form.Label>Contact Person</Form.Label>
                      <Form.Control
                        type="text"
                        name="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        name="emergencyContactPhone"
                        value={formData.emergencyContactPhone}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </>
                ) : (
                  <>
                    <p><strong>Contact Person:</strong> {formData.emergencyContactName}</p>
                    <p><strong>Phone:</strong> {formData.emergencyContactPhone}</p>
                  </>
                )}

                <h5 className="mt-4 mb-3">Job & Education Info</h5>
                {isEditing ? (
                  <>
                    <Form.Group className="mb-2">
                      <Form.Label>Education</Form.Label>
                      <Form.Control
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Team</Form.Label>
                      <Form.Control
                        type="text"
                        name="team"
                        value={formData.team}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Designation</Form.Label>
                      <Form.Control
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Reporting Manager</Form.Label>
                      <Form.Control
                        type="text"
                        name="reportingManager"
                        value={formData.reportingManager}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Date of Joining</Form.Label>
                      <Form.Control
                        type="date"
                        name="dateOfJoining"
                        value={formData.dateOfJoining}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </>
                ) : (
                  <>
                    <p><strong>Education:</strong> {formData.education}</p>
                    <p><strong>Team:</strong> {formData.team}</p>
                    <p><strong>Designation:</strong> {formData.designation}</p>
                    <p><strong>Reporting To:</strong> {formData.reportingManager}</p>
                    <p><strong>Date of Joining:</strong> {formData.dateOfJoining}</p>
                  </>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default EmployeeProfile;

"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader, Col, Row, Button, Form, FormGroup, Label, Input, Nav, NavItem, NavLink, TabContent, TabPane, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Link from "next/link";
import { YBB_ROUTES } from "../../../constants/ybb";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [isPasswordModal, setIsPasswordModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [profileImage, setProfileImage] = useState("/images/users/avatar-1.jpg");

  // Mock profile data
  const [profileData, setProfileData] = useState({
    // Basic Information
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1995-06-15",
    gender: "male",
    nationality: "us",
    
    // Address Information
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "us",
    
    // Educational Information
    currentEducation: "University",
    institution: "Harvard University",
    fieldOfStudy: "Business Administration",
    graduationYear: "2024",
    gpa: "3.8",
    
    // Professional Information
    currentPosition: "Student",
    company: "",
    workExperience: "2",
    linkedinUrl: "https://linkedin.com/in/johndoe",
    
    // Additional Information
    emergencyContactName: "Jane Doe",
    emergencyContactPhone: "+1 (555) 987-6543",
    emergencyContactRelation: "Mother",
    dietaryRestrictions: "None",
    medicalConditions: "",
    
    // Preferences
    language: "en",
    timezone: "America/New_York",
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const toggle = (tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const handleProfileUpdate = (section: string, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationUpdate = (field: string, value: boolean) => {
    setProfileData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value,
      }
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = () => {
    // TODO: Implement password change logic
    console.log("Changing password:", passwordData);
    setIsPasswordModal(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleAccountDelete = () => {
    // TODO: Implement account deletion logic
    console.log("Deleting account");
    setIsDeleteModal(false);
  };

  const saveProfile = () => {
    // TODO: Implement profile save logic
    console.log("Saving profile:", profileData);
    alert("Profile updated successfully!");
  };

  return (
    <div>
      {/* Page Title */}
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0">Profile Settings</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <Link href={YBB_ROUTES.PARTICIPANT.DASHBOARD}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Profile</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <Row>
        {/* Profile Sidebar */}
        <Col xl={3}>
          <Card>
            <CardBody className="text-center">
              <div className="profile-user position-relative d-inline-block mx-auto mb-4">
                <img
                  src={profileImage}
                  className="rounded-circle avatar-xl img-thumbnail user-profile-image material-shadow"
                  alt="user-profile"
                />
                <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                  <Input
                    id="profile-img-file-input"
                    type="file"
                    accept="image/*"
                    className="profile-img-file-input"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                  <Label
                    htmlFor="profile-img-file-input"
                    className="profile-photo-edit avatar-xs"
                  >
                    <span className="avatar-title rounded-circle bg-light text-body material-shadow">
                      <i className="ri-camera-fill"></i>
                    </span>
                  </Label>
                </div>
              </div>
              <h5 className="fs-17 mb-1">{profileData.firstName} {profileData.lastName}</h5>
              <p className="text-muted mb-0">{profileData.currentPosition}</p>
              {profileData.institution && (
                <p className="text-muted mb-0">{profileData.institution}</p>
              )}
            </CardBody>
          </Card>

          {/* Profile Completion */}
          <Card>
            <CardBody>
              <h6 className="mb-3">Profile Completion</h6>
              <div className="progress animated-progress custom-progress progress-label">
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: "85%" }}
                  aria-valuenow={85}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="label">85%</div>
                </div>
              </div>
              <div className="mt-3">
                <small className="text-muted">
                  Complete your profile to improve your application status
                </small>
              </div>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardBody>
              <h6 className="mb-3">Quick Actions</h6>
              <div className="vstack gap-2">
                <Button color="soft-primary" size="sm" block>
                  <i className="ri-download-line me-1"></i>
                  Download Profile
                </Button>
                <Button 
                  color="soft-warning" 
                  size="sm" 
                  block
                  onClick={() => setIsPasswordModal(true)}
                >
                  <i className="ri-lock-password-line me-1"></i>
                  Change Password
                </Button>
                <Button 
                  color="soft-danger" 
                  size="sm" 
                  block
                  onClick={() => setIsDeleteModal(true)}
                >
                  <i className="ri-delete-bin-line me-1"></i>
                  Delete Account
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Profile Content */}
        <Col xl={9}>
          <Card>
            <CardHeader>
              <Nav className="nav-tabs-custom rounded card-header-tabs border-bottom-0">
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={activeTab === "1" ? "active" : ""}
                    onClick={() => toggle("1")}
                  >
                    Personal Info
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={activeTab === "2" ? "active" : ""}
                    onClick={() => toggle("2")}
                  >
                    Education & Work
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={activeTab === "3" ? "active" : ""}
                    onClick={() => toggle("3")}
                  >
                    Emergency Contact
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={activeTab === "4" ? "active" : ""}
                    onClick={() => toggle("4")}
                  >
                    Preferences
                  </NavLink>
                </NavItem>
              </Nav>
            </CardHeader>

            <CardBody>
              <TabContent activeTab={activeTab}>
                {/* Personal Information Tab */}
                <TabPane tabId="1">
                  <Form>
                    <h6 className="mb-3">Basic Information</h6>
                    <Row>
                      <Col lg={6}>
                        <FormGroup>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            type="text"
                            id="firstName"
                            value={profileData.firstName}
                            onChange={(e) => handleProfileUpdate("basic", "firstName", e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={6}>
                        <FormGroup>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            type="text"
                            id="lastName"
                            value={profileData.lastName}
                            onChange={(e) => handleProfileUpdate("basic", "lastName", e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={6}>
                        <FormGroup>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            type="email"
                            id="email"
                            value={profileData.email}
                            onChange={(e) => handleProfileUpdate("basic", "email", e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={6}>
                        <FormGroup>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            type="tel"
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => handleProfileUpdate("basic", "phone", e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={4}>
                        <FormGroup>
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            type="date"
                            id="dateOfBirth"
                            value={profileData.dateOfBirth}
                            onChange={(e) => handleProfileUpdate("basic", "dateOfBirth", e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={4}>
                        <FormGroup>
                          <Label htmlFor="gender">Gender</Label>
                          <Input
                            type="select"
                            id="gender"
                            value={profileData.gender}
                            onChange={(e) => handleProfileUpdate("basic", "gender", e.target.value)}
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer_not_to_say">Prefer not to say</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col lg={4}>
                        <FormGroup>
                          <Label htmlFor="nationality">Nationality</Label>
                          <Input
                            type="select"
                            id="nationality"
                            value={profileData.nationality}
                            onChange={(e) => handleProfileUpdate("basic", "nationality", e.target.value)}
                          >
                            <option value="us">United States</option>
                            <option value="uk">United Kingdom</option>
                            <option value="ca">Canada</option>
                            <option value="au">Australia</option>
                            <option value="tr">Turkey</option>
                            <option value="other">Other</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>

                    <h6 className="mt-4 mb-3">Address Information</h6>
                    <Row>
                      <Col lg={12}>
                        <FormGroup>
                          <Label htmlFor="address">Street Address</Label>
                          <Input
                            type="textarea"
                            id="address"
                            rows={2}
                            value={profileData.address}
                            onChange={(e) => handleProfileUpdate("address", "address", e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={6}>
                        <FormGroup>
                          <Label htmlFor="city">City</Label>
                          <Input
                            type="text"
                            id="city"
                            value={profileData.city}
                            onChange={(e) => handleProfileUpdate("address", "city", e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={3}>
                        <FormGroup>
                          <Label htmlFor="state">State/Province</Label>
                          <Input
                            type="text"
                            id="state"
                            value={profileData.state}
                            onChange={(e) => handleProfileUpdate("address", "state", e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={3}>
                        <FormGroup>
                          <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                          <Input
                            type="text"
                            id="zipCode"
                            value={profileData.zipCode}
                            onChange={(e) => handleProfileUpdate("address", "zipCode", e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </TabPane>

                {/* Education & Work Tab */}
                <TabPane tabId="2">
                  <Form>
                    <h6 className="mb-3">Educational Information</h6>
                    <Row>
                      <Col lg={6}>
                        <FormGroup>
                          <Label htmlFor="currentEducation">Current Education Level</Label>
                          <Input
                            type="select"
                            id="currentEducation"
                            value={profileData.currentEducation}
                            onChange={(e) => handleProfileUpdate("education", "currentEducation", e.target.value)}
                          >
                            <option value="high_school">High School</option>
                            <option value="university">University</option>
                            <option value="masters">Master's Degree</option>
                            <option value="phd">PhD</option>
                            <option value="other">Other</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col lg={6}>
                        <FormGroup>
                          <Label htmlFor="institution">Institution Name</Label>
                          <Input
                            type="text"
                            id="institution"
                            value={profileData.institution}
                            onChange={(e) => handleProfileUpdate("education", "institution", e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={6}>
                        <FormGroup>
                          <Label htmlFor="fieldOfStudy">Field of Study</Label>
                          <Input
                            type="text"
                            id="fieldOfStudy"
                            value={profileData.fieldOfStudy}
                            onChange={(e) => handleProfileUpdate("education", "fieldOfStudy", e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={3}>
                        <FormGroup>
                          <Label htmlFor="graduationYear">Graduation Year</Label>
                          <Input
                            type="text"
                            id="graduationYear"
                            value={profileData.graduationYear}
                            onChange={(e) => handleProfileUpdate("education", "graduationYear", e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={3}>
                        <FormGroup>
                          <Label htmlFor="gpa">GPA (Optional)</Label>
                          <Input
                            type="text"
                            id="gpa"
                            value={profileData.gpa}
                            onChange={(e) => handleProfileUpdate("education", "gpa", e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <h6 className="mt-4 mb-3">Professional Information</h6>
                    <Row>
                      <Col lg={6}>
                        <FormGroup>
                          <Label htmlFor="currentPosition">Current Position</Label>
                          <Input
                            type="text"
                            id="currentPosition"
                            value={profileData.currentPosition}
                            onChange={(e) => handleProfileUpdate("professional", "currentPosition", e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={6}>
                        <FormGroup>
                          <Label htmlFor="company">Company (Optional)</Label>
                          <Input
                            type="text"
                            id="company"
                            value={profileData.company}
                            onChange={(e) => handleProfileUpdate("professional", "company", e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={6}>
                        <FormGroup>
                          <Label htmlFor="workExperience">Years of Work Experience</Label>
                          <Input
                            type="select"
                            id="workExperience"
                            value={profileData.workExperience}
                            onChange={(e) => handleProfileUpdate("professional", "workExperience", e.target.value)}
                          >
                            <option value="0">No experience</option>
                            <option value="1">Less than 1 year</option>
                            <option value="2">1-2 years</option>
                            <option value="3">3-5 years</option>
                            <option value="5">5+ years</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col lg={6}>
                        <FormGroup>
                          <Label htmlFor="linkedinUrl">LinkedIn URL (Optional)</Label>
                          <Input
                            type="url"
                            id="linkedinUrl"
                            value={profileData.linkedinUrl}
                            onChange={(e) => handleProfileUpdate("professional", "linkedinUrl", e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </TabPane>

                {/* Emergency Contact Tab */}
                <TabPane tabId="3">
                  <Form>
                    <h6 className="mb-3">Emergency Contact Information</h6>
                    <Row>
                      <Col lg={6}>
                        <FormGroup>
                          <Label htmlFor="emergencyContactName">Contact Name</Label>
                          <Input
                            type="text"
                            id="emergencyContactName"
                            value={profileData.emergencyContactName}
                            onChange={(e) => handleProfileUpdate("emergency", "emergencyContactName", e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={6}>
                        <FormGroup>
                          <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                          <Input
                            type="tel"
                            id="emergencyContactPhone"
                            value={profileData.emergencyContactPhone}
                            onChange={(e) => handleProfileUpdate("emergency", "emergencyContactPhone", e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={6}>
                        <FormGroup>
                          <Label htmlFor="emergencyContactRelation">Relationship</Label>
                          <Input
                            type="select"
                            id="emergencyContactRelation"
                            value={profileData.emergencyContactRelation}
                            onChange={(e) => handleProfileUpdate("emergency", "emergencyContactRelation", e.target.value)}
                          >
                            <option value="parent">Parent</option>
                            <option value="sibling">Sibling</option>
                            <option value="spouse">Spouse/Partner</option>
                            <option value="friend">Friend</option>
                            <option value="other">Other</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>

                    <h6 className="mt-4 mb-3">Additional Health Information</h6>
                    <Row>
                      <Col lg={6}>
                        <FormGroup>
                          <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                          <Input
                            type="textarea"
                            id="dietaryRestrictions"
                            rows={3}
                            value={profileData.dietaryRestrictions}
                            onChange={(e) => handleProfileUpdate("health", "dietaryRestrictions", e.target.value)}
                            placeholder="Any allergies or dietary requirements..."
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={6}>
                        <FormGroup>
                          <Label htmlFor="medicalConditions">Medical Conditions (Optional)</Label>
                          <Input
                            type="textarea"
                            id="medicalConditions"
                            rows={3}
                            value={profileData.medicalConditions}
                            onChange={(e) => handleProfileUpdate("health", "medicalConditions", e.target.value)}
                            placeholder="Any medical conditions we should be aware of..."
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </TabPane>

                {/* Preferences Tab */}
                <TabPane tabId="4">
                  <Form>
                    <h6 className="mb-3">Language & Region</h6>
                    <Row>
                      <Col lg={6}>
                        <FormGroup>
                          <Label htmlFor="language">Preferred Language</Label>
                          <Input
                            type="select"
                            id="language"
                            value={profileData.language}
                            onChange={(e) => handleProfileUpdate("preferences", "language", e.target.value)}
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="tr">Turkish</option>
                            <option value="ar">Arabic</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col lg={6}>
                        <FormGroup>
                          <Label htmlFor="timezone">Time Zone</Label>
                          <Input
                            type="select"
                            id="timezone"
                            value={profileData.timezone}
                            onChange={(e) => handleProfileUpdate("preferences", "timezone", e.target.value)}
                          >
                            <option value="America/New_York">Eastern Time (UTC-5)</option>
                            <option value="America/Chicago">Central Time (UTC-6)</option>
                            <option value="America/Denver">Mountain Time (UTC-7)</option>
                            <option value="America/Los_Angeles">Pacific Time (UTC-8)</option>
                            <option value="Europe/London">GMT (UTC+0)</option>
                            <option value="Europe/Istanbul">Turkey Time (UTC+3)</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>

                    <h6 className="mt-4 mb-3">Notification Preferences</h6>
                    <div className="vstack gap-3">
                      <div className="form-check form-switch">
                        <Input
                          type="checkbox"
                          id="emailNotifications"
                          checked={profileData.notifications.email}
                          onChange={(e) => handleNotificationUpdate("email", e.target.checked)}
                        />
                        <Label htmlFor="emailNotifications" className="form-check-label">
                          Email Notifications
                        </Label>
                        <div className="form-text">Receive updates and reminders via email</div>
                      </div>
                      <div className="form-check form-switch">
                        <Input
                          type="checkbox"
                          id="smsNotifications"
                          checked={profileData.notifications.sms}
                          onChange={(e) => handleNotificationUpdate("sms", e.target.checked)}
                        />
                        <Label htmlFor="smsNotifications" className="form-check-label">
                          SMS Notifications
                        </Label>
                        <div className="form-text">Receive urgent updates via text message</div>
                      </div>
                      <div className="form-check form-switch">
                        <Input
                          type="checkbox"
                          id="pushNotifications"
                          checked={profileData.notifications.push}
                          onChange={(e) => handleNotificationUpdate("push", e.target.checked)}
                        />
                        <Label htmlFor="pushNotifications" className="form-check-label">
                          Push Notifications
                        </Label>
                        <div className="form-text">Receive browser notifications</div>
                      </div>
                    </div>
                  </Form>
                </TabPane>
              </TabContent>

              {/* Save Button */}
              <div className="mt-4 text-end">
                <Button color="soft-secondary" className="me-2">
                  Cancel
                </Button>
                <Button color="primary" onClick={saveProfile}>
                  <i className="ri-save-line me-1"></i>
                  Save Changes
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Change Password Modal */}
      <Modal isOpen={isPasswordModal} toggle={() => setIsPasswordModal(!isPasswordModal)}>
        <ModalHeader toggle={() => setIsPasswordModal(!isPasswordModal)}>
          Change Password
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                type="password"
                id="currentPassword"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                type="password"
                id="newPassword"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="soft-secondary" onClick={() => setIsPasswordModal(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={handlePasswordChange}>
            Change Password
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Account Modal */}
      <Modal isOpen={isDeleteModal} toggle={() => setIsDeleteModal(!isDeleteModal)}>
        <ModalHeader toggle={() => setIsDeleteModal(!isDeleteModal)}>
          Delete Account
        </ModalHeader>
        <ModalBody>
          <div className="alert alert-danger">
            <h6 className="alert-heading">Warning!</h6>
            <p className="mb-0">
              This action cannot be undone. This will permanently delete your account 
              and remove all of your data from our servers.
            </p>
          </div>
          <p>Please type <strong>DELETE</strong> to confirm:</p>
          <Input
            type="text"
            placeholder="Type DELETE to confirm"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="soft-secondary" onClick={() => setIsDeleteModal(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={handleAccountDelete}>
            Delete Account
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ProfilePage;
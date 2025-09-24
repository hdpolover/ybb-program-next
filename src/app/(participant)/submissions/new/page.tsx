"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader, Col, Row, Form, FormGroup, Label, Input, Button, Progress } from "reactstrap";
import Link from "next/link";
import { YBB_ROUTES } from "../../../../constants/ybb";

const NewSubmissionPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: "",
    lastName: "", 
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    address: "",
    
    // Essays
    motivationLetter: "",
    leadershipExperience: "",
    futureGoals: "",
    
    // Miscellaneous
    dietaryRestrictions: "",
    emergencyContact: "",
    additionalInfo: "",
  });

  const totalSteps = 4;
  const stepProgress = (currentStep / totalSteps) * 100;

  const steps = [
    { id: 1, title: "Personal Details", description: "Basic information about you" },
    { id: 2, title: "Essays", description: "Motivation and experience essays" },
    { id: 3, title: "Miscellaneous", description: "Additional information" },
    { id: 4, title: "Review & Submit", description: "Review and submit application" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // TODO: Implement submission logic
    console.log("Submitting application:", formData);
    alert("Application submitted successfully!");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h5 className="mb-3">Personal Information</h5>
            <Row>
              <Col lg={6}>
                <FormGroup>
                  <Label for="firstName">First Name *</Label>
                  <Input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Enter your first name"
                    required
                  />
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                  <Label for="lastName">Last Name *</Label>
                  <Input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Enter your last name"
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <FormGroup>
                  <Label for="email">Email Address *</Label>
                  <Input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                  <Label for="phone">Phone Number *</Label>
                  <Input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col lg={4}>
                <FormGroup>
                  <Label for="dateOfBirth">Date of Birth *</Label>
                  <Input
                    type="date"
                    id="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    required
                  />
                </FormGroup>
              </Col>
              <Col lg={4}>
                <FormGroup>
                  <Label for="nationality">Nationality *</Label>
                  <Input
                    type="select"
                    id="nationality"
                    value={formData.nationality}
                    onChange={(e) => handleInputChange("nationality", e.target.value)}
                    required
                  >
                    <option value="">Select nationality</option>
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
            <Row>
              <Col lg={12}>
                <FormGroup>
                  <Label for="address">Address *</Label>
                  <Input
                    type="textarea"
                    id="address"
                    rows={3}
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter your full address"
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
          </div>
        );

      case 2:
        return (
          <div>
            <h5 className="mb-3">Essays & Motivation</h5>
            <FormGroup>
              <Label for="motivationLetter">Motivation Letter *</Label>
              <p className="text-muted fs-13 mb-2">
                Tell us why you want to participate in this program (500-1000 words)
              </p>
              <Input
                type="textarea"
                id="motivationLetter"
                rows={8}
                value={formData.motivationLetter}
                onChange={(e) => handleInputChange("motivationLetter", e.target.value)}
                placeholder="Write your motivation letter here..."
                required
              />
              <div className="form-text">
                {formData.motivationLetter.length}/1000 characters
              </div>
            </FormGroup>

            <FormGroup>
              <Label for="leadershipExperience">Leadership Experience *</Label>
              <p className="text-muted fs-13 mb-2">
                Describe your leadership experience and achievements (300-500 words)
              </p>
              <Input
                type="textarea"
                id="leadershipExperience"
                rows={6}
                value={formData.leadershipExperience}
                onChange={(e) => handleInputChange("leadershipExperience", e.target.value)}
                placeholder="Describe your leadership experience..."
                required
              />
              <div className="form-text">
                {formData.leadershipExperience.length}/500 characters
              </div>
            </FormGroup>

            <FormGroup>
              <Label for="futureGoals">Future Goals *</Label>
              <p className="text-muted fs-13 mb-2">
                What are your career goals and how will this program help? (300-500 words)
              </p>
              <Input
                type="textarea"
                id="futureGoals"
                rows={6}
                value={formData.futureGoals}
                onChange={(e) => handleInputChange("futureGoals", e.target.value)}
                placeholder="Describe your future goals..."
                required
              />
              <div className="form-text">
                {formData.futureGoals.length}/500 characters
              </div>
            </FormGroup>
          </div>
        );

      case 3:
        return (
          <div>
            <h5 className="mb-3">Additional Information</h5>
            <FormGroup>
              <Label for="dietaryRestrictions">Dietary Restrictions</Label>
              <Input
                type="textarea"
                id="dietaryRestrictions"
                rows={3}
                value={formData.dietaryRestrictions}
                onChange={(e) => handleInputChange("dietaryRestrictions", e.target.value)}
                placeholder="Any dietary restrictions or allergies?"
              />
            </FormGroup>

            <FormGroup>
              <Label for="emergencyContact">Emergency Contact *</Label>
              <Input
                type="text"
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                placeholder="Name and phone number of emergency contact"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="additionalInfo">Additional Information</Label>
              <Input
                type="textarea"
                id="additionalInfo"
                rows={4}
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                placeholder="Any additional information you'd like to share..."
              />
            </FormGroup>
          </div>
        );

      case 4:
        return (
          <div>
            <h5 className="mb-3">Review Your Application</h5>
            
            <Card className="mb-3">
              <CardHeader>
                <h6 className="mb-0">Personal Information</h6>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col lg={6}>
                    <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                  </Col>
                  <Col lg={6}>
                    <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
                    <p><strong>Nationality:</strong> {formData.nationality}</p>
                  </Col>
                </Row>
                <p><strong>Address:</strong> {formData.address}</p>
              </CardBody>
            </Card>

            <Card className="mb-3">
              <CardHeader>
                <h6 className="mb-0">Essays</h6>
              </CardHeader>
              <CardBody>
                <div className="mb-3">
                  <strong>Motivation Letter:</strong>
                  <p className="mt-2 text-muted">{formData.motivationLetter.substring(0, 200)}...</p>
                </div>
                <div className="mb-3">
                  <strong>Leadership Experience:</strong>
                  <p className="mt-2 text-muted">{formData.leadershipExperience.substring(0, 200)}...</p>
                </div>
                <div>
                  <strong>Future Goals:</strong>
                  <p className="mt-2 text-muted">{formData.futureGoals.substring(0, 200)}...</p>
                </div>
              </CardBody>
            </Card>

            <Card className="mb-3">
              <CardHeader>
                <h6 className="mb-0">Additional Information</h6>
              </CardHeader>
              <CardBody>
                <p><strong>Emergency Contact:</strong> {formData.emergencyContact}</p>
                {formData.dietaryRestrictions && (
                  <p><strong>Dietary Restrictions:</strong> {formData.dietaryRestrictions}</p>
                )}
                {formData.additionalInfo && (
                  <p><strong>Additional Information:</strong> {formData.additionalInfo}</p>
                )}
              </CardBody>
            </Card>

            <div className="alert alert-info">
              <h6 className="alert-heading">Before You Submit</h6>
              <p className="mb-0">
                Please review all information carefully. Once submitted, you will not be able to edit your application.
                You will receive a confirmation email after successful submission.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Page Title */}
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0">New Submission</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <Link href={YBB_ROUTES.PARTICIPANT.DASHBOARD}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href={YBB_ROUTES.PARTICIPANT.SUBMISSIONS}>Submissions</Link>
                </li>
                <li className="breadcrumb-item active">New Submission</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <Row className="mb-4">
        <Col lg={12}>
          <Card>
            <CardBody>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="mb-0">Application Progress</h6>
                <span className="badge bg-soft-primary text-primary fs-12">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
              <Progress value={stepProgress} className="mb-3" />
              <div className="row">
                {steps.map((step) => (
                  <div key={step.id} className="col-lg-3">
                    <div className={`text-center ${step.id <= currentStep ? 'text-primary' : 'text-muted'}`}>
                      <div className={`avatar-sm mx-auto mb-2 ${step.id === currentStep ? 'bg-primary' : step.id < currentStep ? 'bg-success' : 'bg-soft-secondary'}`}>
                        <div className={`avatar-title rounded-circle ${step.id === currentStep ? 'text-white' : step.id < currentStep ? 'text-white' : 'text-muted'}`}>
                          {step.id < currentStep ? (
                            <i className="ri-check-line"></i>
                          ) : (
                            step.id
                          )}
                        </div>
                      </div>
                      <h6 className={`mb-1 ${step.id <= currentStep ? '' : 'text-muted'}`}>
                        {step.title}
                      </h6>
                      <p className="text-muted mb-0 fs-13">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Form Content */}
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              <Form>
                {renderStepContent()}
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Navigation Buttons */}
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  {currentStep > 1 && (
                    <Button color="soft-secondary" onClick={handlePrevious}>
                      <i className="ri-arrow-left-line me-1"></i> Previous
                    </Button>
                  )}
                </div>
                <div>
                  <Button color="soft-warning" className="me-2">
                    <i className="ri-save-line me-1"></i> Save Draft
                  </Button>
                  {currentStep < totalSteps ? (
                    <Button color="primary" onClick={handleNext}>
                      Next <i className="ri-arrow-right-line ms-1"></i>
                    </Button>
                  ) : (
                    <Button color="success" onClick={handleSubmit}>
                      <i className="ri-send-plane-line me-1"></i> Submit Application
                    </Button>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NewSubmissionPage;
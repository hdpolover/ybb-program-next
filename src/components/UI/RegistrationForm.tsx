'use client';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  Row, 
  Col, 
  Card, 
  CardBody, 
  Form, 
  FormGroup, 
  Label, 
  Input, 
  Button, 
  Alert,
  Progress,
  Badge
} from 'reactstrap';

interface RegistrationFormProps {
  programTitle: string;
  registrationType: 'self-funded' | 'fully-funded';
  price: number;
  onSubmit: (values: any) => void;
  onBack?: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  programTitle,
  registrationType,
  price,
  onSubmit,
  onBack
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const totalSteps = 4;

  const validationSchema = Yup.object({
    // Personal Information
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    dateOfBirth: Yup.date().required('Date of birth is required'),
    gender: Yup.string().required('Gender is required'),
    nationality: Yup.string().required('Nationality is required'),
    
    // Address Information
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    country: Yup.string().required('Country is required'),
    postalCode: Yup.string().required('Postal code is required'),
    
    // Educational Background
    university: Yup.string().required('University/Institution is required'),
    fieldOfStudy: Yup.string().required('Field of study is required'),
    graduationYear: Yup.number().required('Expected graduation year is required'),
    
    // Program Specific
    motivation: Yup.string()
      .min(100, 'Motivation must be at least 100 characters')
      .required('Motivation is required'),
    expectations: Yup.string()
      .min(50, 'Expectations must be at least 50 characters')
      .required('Expectations are required'),
    
    // Terms and Conditions
    agreeToTerms: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions'),
    agreeToPrivacy: Yup.boolean().oneOf([true], 'You must agree to the privacy policy')
  });

  const formik = useFormik({
    initialValues: {
      // Personal Information
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      nationality: '',
      
      // Address Information
      address: '',
      city: '',
      country: '',
      postalCode: '',
      
      // Educational Background
      university: '',
      fieldOfStudy: '',
      graduationYear: new Date().getFullYear() + 2,
      
      // Program Specific
      motivation: '',
      expectations: '',
      
      // Terms
      agreeToTerms: false,
      agreeToPrivacy: false
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitStatus('loading');
      try {
        await onSubmit({ ...values, registrationType, price });
        setSubmitStatus('success');
      } catch (error) {
        setSubmitStatus('error');
      }
    }
  });

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Personal Information';
      case 2: return 'Address & Contact';
      case 3: return 'Educational Background';
      case 4: return 'Program Application';
      default: return 'Registration';
    }
  };

  const getProgressPercentage = () => {
    return (currentStep / totalSteps) * 100;
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h4 className="mb-4">Personal Information</h4>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>First Name *</Label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={!!(formik.touched.firstName && formik.errors.firstName)}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <div className="invalid-feedback d-block">{formik.errors.firstName}</div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Last Name *</Label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={!!(formik.touched.lastName && formik.errors.lastName)}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <div className="invalid-feedback d-block">{formik.errors.lastName}</div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={!!(formik.touched.email && formik.errors.email)}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback d-block">{formik.errors.email}</div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Phone Number *</Label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={!!(formik.touched.phone && formik.errors.phone)}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <div className="invalid-feedback d-block">{formik.errors.phone}</div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Date of Birth *</Label>
                  <Input
                    type="date"
                    name="dateOfBirth"
                    value={formik.values.dateOfBirth}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={!!(formik.touched.dateOfBirth && formik.errors.dateOfBirth)}
                  />
                  {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                    <div className="invalid-feedback d-block">{formik.errors.dateOfBirth}</div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Gender *</Label>
                  <Input
                    type="select"
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={!!(formik.touched.gender && formik.errors.gender)}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </Input>
                  {formik.touched.gender && formik.errors.gender && (
                    <div className="invalid-feedback d-block">{formik.errors.gender}</div>
                  )}
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label>Nationality *</Label>
                  <Input
                    type="text"
                    name="nationality"
                    value={formik.values.nationality}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={!!(formik.touched.nationality && formik.errors.nationality)}
                  />
                  {formik.touched.nationality && formik.errors.nationality && (
                    <div className="invalid-feedback d-block">{formik.errors.nationality}</div>
                  )}
                </FormGroup>
              </Col>
            </Row>
          </div>
        );
      
      case 2:
        return (
          <div>
            <h4 className="mb-4">Address & Contact Information</h4>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label>Address *</Label>
                  <Input
                    type="text"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={!!(formik.touched.address && formik.errors.address)}
                  />
                  {formik.touched.address && formik.errors.address && (
                    <div className="invalid-feedback d-block">{formik.errors.address}</div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>City *</Label>
                  <Input
                    type="text"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={!!(formik.touched.city && formik.errors.city)}
                  />
                  {formik.touched.city && formik.errors.city && (
                    <div className="invalid-feedback d-block">{formik.errors.city}</div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Country *</Label>
                  <Input
                    type="text"
                    name="country"
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={!!(formik.touched.country && formik.errors.country)}
                  />
                  {formik.touched.country && formik.errors.country && (
                    <div className="invalid-feedback d-block">{formik.errors.country}</div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Postal Code *</Label>
                  <Input
                    type="text"
                    name="postalCode"
                    value={formik.values.postalCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={!!(formik.touched.postalCode && formik.errors.postalCode)}
                  />
                  {formik.touched.postalCode && formik.errors.postalCode && (
                    <div className="invalid-feedback d-block">{formik.errors.postalCode}</div>
                  )}
                </FormGroup>
              </Col>
            </Row>
          </div>
        );
      
      case 3:
        return (
          <div>
            <h4 className="mb-4">Educational Background</h4>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label>University/Institution *</Label>
                  <Input
                    type="text"
                    name="university"
                    value={formik.values.university}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={!!(formik.touched.university && formik.errors.university)}
                  />
                  {formik.touched.university && formik.errors.university && (
                    <div className="invalid-feedback d-block">{formik.errors.university}</div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Field of Study *</Label>
                  <Input
                    type="text"
                    name="fieldOfStudy"
                    value={formik.values.fieldOfStudy}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={!!(formik.touched.fieldOfStudy && formik.errors.fieldOfStudy)}
                  />
                  {formik.touched.fieldOfStudy && formik.errors.fieldOfStudy && (
                    <div className="invalid-feedback d-block">{formik.errors.fieldOfStudy}</div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Expected Graduation Year *</Label>
                  <Input
                    type="number"
                    name="graduationYear"
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 10}
                    value={formik.values.graduationYear}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={!!(formik.touched.graduationYear && formik.errors.graduationYear)}
                  />
                  {formik.touched.graduationYear && formik.errors.graduationYear && (
                    <div className="invalid-feedback d-block">{formik.errors.graduationYear}</div>
                  )}
                </FormGroup>
              </Col>
            </Row>
          </div>
        );
      
      case 4:
        return (
          <div>
            <h4 className="mb-4">Program Application</h4>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label>Motivation (Why do you want to join this program?) *</Label>
                  <Input
                    type="textarea"
                    rows={5}
                    name="motivation"
                    value={formik.values.motivation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={!!(formik.touched.motivation && formik.errors.motivation)}
                  />
                  <small className="text-muted">
                    Characters: {formik.values.motivation.length} (minimum 100 required)
                  </small>
                  {formik.touched.motivation && formik.errors.motivation && (
                    <div className="invalid-feedback d-block">{formik.errors.motivation}</div>
                  )}
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label>Expectations (What do you hope to achieve?) *</Label>
                  <Input
                    type="textarea"
                    rows={4}
                    name="expectations"
                    value={formik.values.expectations}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={!!(formik.touched.expectations && formik.errors.expectations)}
                  />
                  <small className="text-muted">
                    Characters: {formik.values.expectations.length} (minimum 50 required)
                  </small>
                  {formik.touched.expectations && formik.errors.expectations && (
                    <div className="invalid-feedback d-block">{formik.errors.expectations}</div>
                  )}
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formik.values.agreeToTerms}
                      onChange={formik.handleChange}
                    />
                    I agree to the <a href="/terms" target="_blank">Terms and Conditions</a> *
                  </Label>
                  {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
                    <div className="text-danger small">{formik.errors.agreeToTerms}</div>
                  )}
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      name="agreeToPrivacy"
                      checked={formik.values.agreeToPrivacy}
                      onChange={formik.handleChange}
                    />
                    I agree to the <a href="/privacy" target="_blank">Privacy Policy</a> *
                  </Label>
                  {formik.touched.agreeToPrivacy && formik.errors.agreeToPrivacy && (
                    <div className="text-danger small">{formik.errors.agreeToPrivacy}</div>
                  )}
                </FormGroup>
              </Col>
            </Row>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (submitStatus === 'success') {
    return (
      <Card>
        <CardBody className="text-center py-5">
          <div className="mb-4">
            <i className="ri-checkbox-circle-line text-success" style={{ fontSize: '4rem' }}></i>
          </div>
          <h3 className="text-success mb-3">Registration Successful!</h3>
          <p className="text-muted mb-4">
            Thank you for registering for {programTitle}. We'll send you a confirmation email shortly with next steps.
          </p>
          <Badge color="success" pill className="mb-3">
            Application ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </Badge>
          <div className="d-flex gap-2 justify-content-center">
            <Button color="primary" onClick={() => window.location.href = '/'}>
              Back to Home
            </Button>
            <Button color="outline-primary" onClick={() => window.print()}>
              Print Confirmation
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        {/* Header */}
        <div className="border-bottom pb-4 mb-4">
          <h3 className="mb-2">{programTitle}</h3>
          <div className="d-flex align-items-center gap-3">
            <Badge color={registrationType === 'fully-funded' ? 'success' : 'primary'}>
              {registrationType === 'fully-funded' ? 'Fully Funded' : 'Self Funded'}
            </Badge>
            <span className="text-muted">Registration Fee: <strong>${price}</strong></span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-2">
            <small className="text-muted">Step {currentStep} of {totalSteps}</small>
            <small className="text-muted">{Math.round(getProgressPercentage())}% Complete</small>
          </div>
          <Progress value={getProgressPercentage()} color="primary" />
          <div className="text-center mt-2">
            <h5 className="mb-0">{getStepTitle(currentStep)}</h5>
          </div>
        </div>

        {/* Form Content */}
        <Form onSubmit={formik.handleSubmit}>
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="d-flex justify-content-between mt-4 pt-4 border-top">
            <div>
              {currentStep > 1 && (
                <Button color="outline-secondary" onClick={prevStep}>
                  <i className="ri-arrow-left-line me-2"></i>
                  Previous
                </Button>
              )}
              {onBack && currentStep === 1 && (
                <Button color="outline-secondary" onClick={onBack}>
                  <i className="ri-arrow-left-line me-2"></i>
                  Back
                </Button>
              )}
            </div>
            <div>
              {currentStep < totalSteps ? (
                <Button color="primary" onClick={nextStep}>
                  Next
                  <i className="ri-arrow-right-line ms-2"></i>
                </Button>
              ) : (
                <Button 
                  color="success" 
                  type="submit"
                  disabled={submitStatus === 'loading'}
                >
                  {submitStatus === 'loading' ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="ri-send-plane-line me-2"></i>
                      Submit Application
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </Form>

        {/* Error Message */}
        {submitStatus === 'error' && (
          <Alert color="danger" className="mt-3">
            <i className="ri-error-warning-line me-2"></i>
            There was an error submitting your application. Please try again.
          </Alert>
        )}
      </CardBody>
    </Card>
  );
};

export default RegistrationForm;
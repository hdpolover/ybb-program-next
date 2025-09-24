'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PublicLayout from '@/layouts/PublicLayout';
import RegistrationForm from '@/components/UI/RegistrationForm';
import Section from '@/components/UI/Section';
import { Row, Col, Card, CardBody, Button, Alert } from 'reactstrap';

const RegisterPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] = useState<'self-funded' | 'fully-funded' | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const type = searchParams.get('type') as 'self-funded' | 'fully-funded';
    if (type) {
      setSelectedType(type);
      setShowForm(true);
    }
  }, [searchParams]);

  const programData = {
    title: "Istanbul Youth Summit 2026",
    selfFundedPrice: 15,
    fullyFundedPrice: 10,
    description: "Join hundreds of young leaders from around the world in this transformative experience.",
    benefits: [
      "4-day intensive program in Istanbul, Turkey",
      "Global networking opportunities", 
      "Leadership development workshops",
      "Cultural exchange activities",
      "Certificate of participation",
      "Award opportunities"
    ]
  };

  const handleRegistrationSubmit = async (formData: any) => {
    // Mock API call - in real app this would call your backend
    console.log('Registration data:', formData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo purposes, we'll just log the data
    // In real app: const response = await fetch('/api/registrations', { method: 'POST', body: JSON.stringify(formData) });
  };

  const handleTypeSelection = (type: 'self-funded' | 'fully-funded') => {
    setSelectedType(type);
    setShowForm(true);
  };

  const handleBackToSelection = () => {
    setShowForm(false);
    setSelectedType(null);
  };

  if (showForm && selectedType) {
    return (
      <PublicLayout>
        <Section padding="xl">
          <Row className="justify-content-center">
            <Col lg={10}>
              <RegistrationForm
                programTitle={programData.title}
                registrationType={selectedType}
                price={selectedType === 'fully-funded' ? programData.fullyFundedPrice : programData.selfFundedPrice}
                onSubmit={handleRegistrationSubmit}
                onBack={handleBackToSelection}
              />
            </Col>
          </Row>
        </Section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Hero Section */}
      <Section background="gradient" padding="lg" className="text-white text-center">
        <h1 className="display-5 fw-bold mb-3">Register for {programData.title}</h1>
        <p className="lead mb-0">{programData.description}</p>
      </Section>

      {/* Registration Options */}
      <Section padding="xl">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">Choose Your Registration Type</h2>
          <p className="lead text-muted">Select the option that best fits your situation</p>
        </div>

        <Row className="justify-content-center">
          <Col lg={5} md={6} className="mb-4">
            <Card className="h-100 border-2 registration-option-card">
              <CardBody className="p-4 text-center">
                <div className="mb-3">
                  <i className="ri-user-line text-primary" style={{ fontSize: '3rem' }}></i>
                </div>
                <h3 className="h4 mb-3">Self Funded</h3>
                <div className="display-4 text-primary mb-3">${programData.selfFundedPrice}</div>
                <p className="text-muted mb-4">
                  Pay the full registration fee yourself. This option gives you complete independence 
                  in your application process.
                </p>
                
                {/* Self Funded Status */}
                <Alert color="danger" className="mb-4">
                  <i className="ri-close-circle-line me-2"></i>
                  <strong>Registration Closed</strong>
                  <div className="small mt-1">
                    Registration period: Oct 03, 2025 - Dec 31, 2025
                  </div>
                </Alert>

                <Button 
                  color="outline-primary" 
                  size="lg" 
                  className="w-100"
                  disabled
                >
                  Registration Closed
                </Button>
              </CardBody>
            </Card>
          </Col>

          <Col lg={5} md={6} className="mb-4">
            <Card className="h-100 border-2 border-success registration-option-card recommended">
              <CardBody className="p-4 text-center">
                <div className="position-absolute top-0 start-50 translate-middle">
                  <span className="badge bg-success">Recommended</span>
                </div>
                <div className="mb-3 mt-3">
                  <i className="ri-heart-line text-success" style={{ fontSize: '3rem' }}></i>
                </div>
                <h3 className="h4 mb-3">Fully Funded</h3>
                <div className="display-4 text-success mb-3">${programData.fullyFundedPrice}</div>
                <p className="text-muted mb-4">
                  Reduced registration fee with potential for additional support. 
                  Limited spots available for qualifying candidates.
                </p>

                {/* Fully Funded Status */}
                <Alert color="success" className="mb-4">
                  <i className="ri-check-circle-line me-2"></i>
                  <strong>Registration Open</strong>
                  <div className="small mt-1">
                    Registration period: Aug 06, 2025 - Oct 02, 2025
                  </div>
                </Alert>

                <Button 
                  color="success" 
                  size="lg" 
                  className="w-100 mb-2"
                  onClick={() => handleTypeSelection('fully-funded')}
                >
                  <i className="ri-user-add-line me-2"></i>
                  Register as Fully Funded
                </Button>
                <Button 
                  color="outline-success" 
                  size="sm" 
                  className="w-100"
                >
                  <i className="ri-information-line me-2"></i>
                  View Details
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Program Benefits */}
        <div className="mt-5 pt-5 border-top">
          <div className="text-center mb-4">
            <h3>What's Included</h3>
            <p className="text-muted">Everything you need for a transformative experience</p>
          </div>
          
          <Row>
            {programData.benefits.map((benefit, index) => (
              <Col key={index} md={6} lg={4} className="mb-3">
                <div className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                    <i className="ri-check-line text-success"></i>
                  </div>
                  <span>{benefit}</span>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Important Information */}
        <div className="mt-5 pt-5 border-top">
          <Alert color="info">
            <h5 className="alert-heading">
              <i className="ri-information-line me-2"></i>
              Important Information
            </h5>
            <ul className="mb-0">
              <li>All registration fees are non-refundable</li>
              <li>Full payment is required upon submission</li>
              <li>Selected participants will receive confirmation within 2 weeks</li>
              <li>Additional documentation may be required for verification</li>
            </ul>
          </Alert>
        </div>
      </Section>
    </PublicLayout>
  );
};

export default RegisterPage;
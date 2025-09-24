'use client';
import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import Section from '@/components/UI/Section';
import StatCard from '@/components/UI/StatCard';
import { Row, Col, Card, CardBody, Badge, Progress } from 'reactstrap';

const InsightsPage: React.FC = () => {
  // Mock data based on the website content
  const programStats = {
    totalParticipants: 4323,
    totalCountries: 124,
    averagePerCountry: 34.9,
    currentProgram: {
      participants: 58,
      status: "Registration Open",
      duration: "Feb 9 - Feb 12, 2026"
    }
  };

  const programTheme = {
    title: "From Vision to Action: Empowering Youth for Lasting Global Impact",
    schedule: "February 9 - 12, 2026",
    subthemes: [
      {
        id: 3,
        title: "Good Health and Well-being",
        description: "Improving youth access to mental health support, public health education, and basic healthcare services.",
        sdg: "SDG 3"
      },
      {
        id: 4,
        title: "Quality Education", 
        description: "Expanding equal access to quality learning through digital tools, alternative education, and youth skill development.",
        sdg: "SDG 4"
      },
      {
        id: 8,
        title: "Decent Work and Economic Growth",
        description: "Creating jobs and entrepreneurship opportunities for youth in the digital and creative economy.",
        sdg: "SDG 8"
      },
      {
        id: 13,
        title: "Climate Action",
        description: "Empowering youth to lead climate campaigns, promote sustainability, and build eco-friendly solutions.",
        sdg: "SDG 13"
      },
      {
        id: 16,
        title: "Peace, Justice, and Strong Institutions",
        description: "Promoting youth participation in governance, conflict prevention, and access to justice.",
        sdg: "SDG 16"
      }
    ]
  };

  const topCountries = [
    { country: "Indonesia", participants: 892, percentage: 20.6 },
    { country: "Turkey", participants: 567, percentage: 13.1 },
    { country: "India", participants: 445, percentage: 10.3 },
    { country: "Nigeria", participants: 378, percentage: 8.7 },
    { country: "Brazil", participants: 321, percentage: 7.4 },
    { country: "Pakistan", participants: 298, percentage: 6.9 },
    { country: "Bangladesh", participants: 267, percentage: 6.2 },
    { country: "Mexico", participants: 234, percentage: 5.4 },
    { country: "Egypt", participants: 198, percentage: 4.6 },
    { country: "Philippines", participants: 187, percentage: 4.3 }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <Section background="gradient" padding="lg" className="text-white text-center">
        <h1 className="display-5 fw-bold mb-3">Program Insights</h1>
        <p className="lead mb-0">
          Discover comprehensive analytics and performance statistics highlighting our programs
        </p>
      </Section>

      {/* Current Program Status */}
      <Section padding="lg">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">Istanbul Youth Summit 2026</h2>
        </div>
        
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <StatCard
              icon="ri-group-line"
              number={programStats.currentProgram.participants}
              label="Total Participants"
              color="primary"
            />
          </Col>
          <Col lg={3} md={6}>
            <Card className="text-center h-100">
              <CardBody className="d-flex flex-column justify-content-center">
                <Badge color="success" className="mb-2 mx-auto">
                  {programStats.currentProgram.status}
                </Badge>
                <h6 className="text-muted mb-0">Program Status</h6>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6} md={12}>
            <Card className="text-center h-100">
              <CardBody className="d-flex flex-column justify-content-center">
                <h5 className="mb-2">{programStats.currentProgram.duration}</h5>
                <h6 className="text-muted mb-0">Program Duration</h6>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Section>

      {/* Program Theme */}
      <Section background="light" padding="xl">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">Program Theme</h2>
          <h3 className="h4 text-primary mb-3">{programTheme.title}</h3>
          <p className="lead text-muted">{programTheme.schedule}</p>
        </div>

        <div className="mb-5">
          <h4 className="text-center mb-4">Program Subthemes</h4>
          <Row className="g-4">
            {programTheme.subthemes.map((subtheme, index) => (
              <Col key={subtheme.id} lg={6} className="mb-3">
                <Card className="h-100 border-0 shadow-sm">
                  <CardBody className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                        <span className="fw-bold">{subtheme.id}</span>
                      </div>
                      <Badge color="info" className="small">
                        {subtheme.sdg}
                      </Badge>
                    </div>
                    <h5 className="mb-3">{subtheme.title}</h5>
                    <p className="text-muted mb-0 lh-lg">{subtheme.description}</p>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Section>

      {/* Historical Statistics */}
      <Section padding="xl">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">Historical Impact</h2>
          <p className="lead text-muted">Our global reach and participant statistics across all programs</p>
        </div>

        <Row className="g-4 mb-5">
          <Col lg={4} md={6}>
            <StatCard
              icon="ri-group-line"
              number={programStats.totalParticipants.toLocaleString()}
              label="Total Participants"
              color="primary"
            />
          </Col>
          <Col lg={4} md={6}>
            <StatCard
              icon="ri-earth-line"
              number={programStats.totalCountries}
              label="Total Countries"
              color="success"
            />
          </Col>
          <Col lg={4} md={12}>
            <StatCard
              icon="ri-bar-chart-line"
              number={programStats.averagePerCountry}
              label="Average per Country"
              color="info"
            />
          </Col>
        </Row>
      </Section>

      {/* Participant Distribution */}
      <Section background="light" padding="xl">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">Participants by Country</h2>
          <p className="lead text-muted">Top 10 countries with highest participation</p>
        </div>

        <Row>
          <Col lg={8} className="mx-auto">
            {topCountries.map((item, index) => (
              <div key={item.country} className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-primary me-3">{index + 1}</span>
                    <h6 className="mb-0">{item.country}</h6>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold">{item.participants.toLocaleString()}</div>
                    <small className="text-muted">{item.percentage}%</small>
                  </div>
                </div>
                <Progress
                  value={item.percentage}
                  color={index < 3 ? 'success' : index < 6 ? 'primary' : 'info'}
                  className="mb-2"
                  style={{ height: '8px' }}
                />
              </div>
            ))}
          </Col>
        </Row>

        <div className="text-center mt-5">
          <p className="text-muted">
            <strong>124 countries</strong> represented across all programs
          </p>
        </div>
      </Section>

      {/* Call to Action */}
      <Section background="gradient" padding="lg" className="text-white text-center">
        <h3 className="mb-4">Want to be part of these statistics?</h3>
        <p className="lead mb-4">Join our growing community of young leaders making global impact.</p>
        <div className="d-flex flex-wrap gap-3 justify-content-center">
          <a href="/apply" className="btn btn-light btn-lg">
            <i className="ri-user-add-line me-2"></i>
            Apply Now
          </a>
          <a href="/programs" className="btn btn-outline-light btn-lg">
            <i className="ri-information-line me-2"></i>
            Learn More
          </a>
        </div>
      </Section>
    </PublicLayout>
  );
};

export default InsightsPage;
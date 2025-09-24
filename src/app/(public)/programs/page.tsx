'use client';
import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import Section from '@/components/UI/Section';
import VisionMission from '@/components/UI/VisionMission';
import Benefits from '@/components/UI/Benefits';
import CountdownTimer from '@/components/UI/CountdownTimer';
import { Row, Col, Button, Badge } from 'reactstrap';

const ProgramsPage: React.FC = () => {
  // Mock data - in real app this would come from API
  const programData = {
    title: "Istanbul Youth Summit 2026",
    subtitle: "Collaboration in Diversity",
    description: "A premier international platform that empowers young leaders to address global challenges through innovation, collaboration, and transformative leadership.",
    image: "https://storage.ybbfoundation.com/programs/10/images/banner_1754397811.jpg",
    duration: "4 days",
    startDate: "Feb 09, 2026", 
    endDate: "Feb 12, 2026",
    targetDate: "2026-02-09T09:00:00",
    location: "Istanbul, Turkey",
    status: "Registration Open"
  };

  const visionData = {
    title: "Our Vision",
    content: "To empower young people to become impactful contributors in addressing global challenges through leadership, collaboration, and innovation. Through the Istanbul Youth Summit, we aspire to create a dynamic environment where youth can explore ideas, grow their potential, and take part in shaping a more connected and solution-oriented global community.",
    icon: "ri-eye-line"
  };

  const missionData = {
    title: "Our Missions", 
    icon: "ri-target-line",
    items: [
      "To build the capacity of youth in leadership, communication, and critical thinking.",
      "To strengthen international collaboration and cultural understanding among participants.",
      "To provide a platform for youth to initiate and implement social projects that bring real impact.",
      "To facilitate meaningful dialogue and experience-sharing between youth and global change-makers.",
      "To establish sustainable networks that support long-term youth engagement and cooperation."
    ]
  };

  const objectives = [
    {
      id: 1,
      title: "Cultivate Youth Leadership",
      description: "To cultivate a spirit of youth leadership and collaboration on a global scale.",
      icon: "ri-user-star-line"
    },
    {
      id: 2,
      title: "Encourage Innovation",
      description: "To encourage innovative thinking and initiative-based learning among young participants.",
      icon: "ri-lightbulb-line"
    },
    {
      id: 3,
      title: "Provide Inclusive Platform",
      description: "To provide an inclusive platform where youth can present real-world solutions and engage in meaningful dialogue.",
      icon: "ri-community-line"
    },
    {
      id: 4,
      title: "Establish Global Network",
      description: "To establish a vibrant international network that supports ongoing youth empowerment.",
      icon: "ri-global-line"
    },
    {
      id: 5,
      title: "Shape Sustainable Future",
      description: "To highlight the role of youth in shaping a more sustainable, inclusive, and equitable future.",
      icon: "ri-plant-line"
    }
  ];

  const benefits = [
    {
      id: 1,
      title: "Global Insights",
      description: "Attend impactful sessions led by global leaders, professionals, and innovators addressing today's most pressing challenges from diverse perspectives.",
      icon: "ri-global-line",
      color: "primary" as const
    },
    {
      id: 2,
      title: "Leadership & Vision",
      description: "Join leadership forums and strategic discussions designed to sharpen your critical thinking and equip you to become an effective changemaker.",
      icon: "ri-user-star-line", 
      color: "success" as const
    },
    {
      id: 3,
      title: "Cross-Cultural Collaboration",
      description: "Work alongside youth from various countries to co-create innovative ideas and solutions that empower local and global communities.",
      icon: "ri-team-line",
      color: "info" as const
    },
    {
      id: 4,
      title: "Global Network",
      description: "Connect with influential individuals, youth leaders, and professionals, building lasting relationships through shared goals and mutual collaboration.",
      icon: "ri-links-line",
      color: "warning" as const
    },
    {
      id: 5,
      title: "Academic Pathways", 
      description: "Discover opportunities for higher education and international scholarships, including information sessions on leading universities and global programs.",
      icon: "ri-graduation-cap-line",
      color: "danger" as const
    },
    {
      id: 6,
      title: "Cultural Experience",
      description: "Experience the cultural richness of Istanbul through guided visits to its iconic sites, offering insights into its historical significance and global legacy.",
      icon: "ri-map-pin-line",
      color: "primary" as const
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <Section background="gradient" padding="xl" className="text-white">
        <Row className="align-items-center">
          <Col lg={8}>
            <div className="fade-in-left">
              <Badge color="light" className="mb-3">
                <i className="ri-calendar-line me-1"></i>
                {programData.status}
              </Badge>
              <h1 className="display-5 fw-bold mb-3">{programData.title}</h1>
              <p className="lead mb-4 opacity-75">{programData.subtitle}</p>
              <p className="mb-4 opacity-75">{programData.description}</p>
              
              <Row className="g-3 mb-4">
                <Col sm={6} md={3}>
                  <div className="text-center">
                    <i className="ri-time-line fs-4 mb-2 d-block"></i>
                    <div className="small opacity-75">Duration</div>
                    <div className="fw-bold">{programData.duration}</div>
                  </div>
                </Col>
                <Col sm={6} md={3}>
                  <div className="text-center">
                    <i className="ri-calendar-line fs-4 mb-2 d-block"></i>
                    <div className="small opacity-75">Dates</div>
                    <div className="fw-bold">{programData.startDate}</div>
                  </div>
                </Col>
                <Col sm={6} md={3}>
                  <div className="text-center">
                    <i className="ri-map-pin-line fs-4 mb-2 d-block"></i>
                    <div className="small opacity-75">Location</div>
                    <div className="fw-bold">{programData.location}</div>
                  </div>
                </Col>
                <Col sm={6} md={3}>
                  <div className="text-center">
                    <i className="ri-group-line fs-4 mb-2 d-block"></i>
                    <div className="small opacity-75">Format</div>
                    <div className="fw-bold">In-Person</div>
                  </div>
                </Col>
              </Row>
              
              <div className="d-flex flex-wrap gap-3">
                <Button color="light" size="lg" href="/apply">
                  <i className="ri-user-add-line me-2"></i>
                  Register Now
                </Button>
                <Button color="outline-light" size="lg">
                  <i className="ri-download-line me-2"></i>
                  Download Brochure
                </Button>
              </div>
            </div>
          </Col>
          <Col lg={4}>
            <div className="fade-in-right">
              <div className="text-center">
                <h5 className="text-white mb-3">Event Starts In</h5>
                <CountdownTimer 
                  targetDate={programData.targetDate}
                  size="md"
                />
              </div>
            </div>
          </Col>
        </Row>
      </Section>

      {/* Program Image */}
      <Section padding="sm">
        <div className="text-center">
          <img 
            src={programData.image}
            alt={programData.title}
            className="img-fluid rounded shadow"
            style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
          />
        </div>
      </Section>

      {/* Vision & Mission */}
      <Section background="light" padding="xl">
        <VisionMission
          vision={visionData}
          mission={missionData}
          className="fade-in-up"
        />
      </Section>

      {/* Objectives */}
      <Section padding="xl">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">Program Objectives</h2>
          <p className="lead text-muted">The key goals we aim to achieve through this program</p>
        </div>
        
        <Row className="g-4">
          {objectives.map((objective, index) => (
            <Col key={objective.id} lg={6} className="mb-4">
              <div className="objective-card d-flex align-items-start p-4 bg-light rounded">
                <div className="objective-number bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {objective.id}
                </div>
                <div>
                  <h5 className="mb-2">{objective.title}</h5>
                  <p className="text-muted mb-0">{objective.description}</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Section>

      {/* Benefits */}
      <Section background="light" padding="xl">
        <Benefits
          benefits={benefits}
          layout="grid"
          columns={3}
          className="fade-in-up"
        />
      </Section>

      {/* Call to Action */}
      <Section background="gradient" padding="xl" className="text-white text-center">
        <h2 className="display-6 fw-bold mb-4">Ready to Join Us?</h2>
        <p className="lead mb-5 opacity-75">
          Don't miss this opportunity to be part of a transformative experience that will shape your future leadership journey.
        </p>
        <div className="d-flex flex-wrap gap-3 justify-content-center">
          <Button color="light" size="lg" className="px-5" href="/apply">
            <i className="ri-user-add-line me-2"></i>
            Register as Fully Funded
          </Button>
          <Button color="outline-light" size="lg" className="px-5">
            <i className="ri-information-line me-2"></i>
            Learn More
          </Button>
        </div>
      </Section>
    </PublicLayout>
  );
};

export default ProgramsPage;
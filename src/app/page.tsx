'use client';
import React from "react";
import Link from "next/link";
import PublicLayout from "@/layouts/PublicLayout";
import { YBB_ROUTES } from "@/constants/ybb";
import CountdownTimer from "@/components/UI/CountdownTimer";
import StatCard from "@/components/UI/StatCard";
import ProgramCard from "@/components/UI/ProgramCard";
import Section from "@/components/UI/Section";
import { Button, Row, Col } from "reactstrap";

// Add styles for ribbons, gradients, and countdown timer
const customStyles = `
  .bg-gradient-primary {
    background: linear-gradient(45deg, #6f42c1, #d63384) !important;
  }
  .bg-gradient-success {
    background: linear-gradient(45deg, #20c997, #0f5132) !important;
  }
  .bg-gradient-warning {
    background: linear-gradient(45deg, #ffc107, #fd7e14) !important;
  }
  .bg-gradient-info {
    background: linear-gradient(45deg, #0dcaf0, #6f42c1) !important;
  }
  .ribbon-corner {
    position: relative;
  }
  .ribbon-text {
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .material-shadow {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
  }
  
  /* Countdown Timer Styles - Subtle and Clean */
  .countdown-timer {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .countdown-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255, 255, 255, 0.95);
    padding: 1.2rem 1rem;
    border-radius: 8px;
    min-width: 75px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 123, 255, 0.2);
  }
  
  .countdown-number {
    font-size: 2rem;
    font-weight: 700;
    color: #0d6efd;
    line-height: 1;
  }
  
  .countdown-label {
    font-size: 0.75rem;
    color: #6c757d;
    margin-top: 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 500;
  }
  
  .countdown-separator {
    font-size: 1.5rem;
    color: #6c757d;
    font-weight: 400;
    margin: 0 0.3rem;
  }
  
  .countdown-expired {
    font-size: 1.2rem;
    color: #dc3545;
    font-weight: 600;
    padding: 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    border: 1px solid rgba(220, 53, 69, 0.2);
  }
  
  /* Size variations */
  .countdown-lg .countdown-item {
    padding: 1.5rem 1.2rem;
    min-width: 85px;
  }
  
  .countdown-lg .countdown-number {
    font-size: 2.5rem;
  }
  
  .countdown-lg .countdown-label {
    font-size: 0.8rem;
  }
  
  .countdown-lg .countdown-separator {
    font-size: 1.8rem;
  }
  
  .countdown-md .countdown-item {
    padding: 1rem 0.8rem;
    min-width: 65px;
  }
  
  .countdown-md .countdown-number {
    font-size: 1.8rem;
  }
  
  .countdown-sm .countdown-item {
    padding: 0.8rem 0.6rem;
    min-width: 55px;
  }
  
  .countdown-sm .countdown-number {
    font-size: 1.4rem;
  }
  
  .countdown-sm .countdown-label {
    font-size: 0.65rem;
  }
`;

type ProgramStatus = 'registration_open' | 'registration_closed' | 'upcoming' | 'completed';

interface ProgramPart {
  id: string;
  partNumber: number;
  title: string;
  duration: string;
  startDate: string;
  endDate: string;
  targetDate: string;
  registrationStart: string;
  registrationEnd: string;
  status: ProgramStatus;
  price: {
    selfFunded: number;
    fullyFunded: number;
  };
  availableSpots: number;
  registeredCount: number;
  description: string;
}

export default function Home() {
  // Mock data - in real app this would come from API
  const programInfo = {
    title: "Istanbul Youth Summit",
    year: "2026", 
    subtitle: "Collaboration in Diversity",
    description: "A premier international platform that empowers young leaders to address global challenges through innovation, collaboration, and transformative leadership.",
    location: "Istanbul, Turkey"
  };

  // Multiple program parts with different statuses and dates
  const programParts: ProgramPart[] = [
    {
      id: "iys-2026-part1",
      partNumber: 1,
      title: "Istanbul Youth Summit 2026 - Part 1",
      duration: "4 days",
      startDate: "Feb 09, 2026",
      endDate: "Feb 12, 2026", 
      targetDate: "2026-02-09T09:00:00",
      registrationStart: "2025-08-01T00:00:00",
      registrationEnd: "2025-12-31T23:59:59",
      status: 'registration_open',
      price: {
        selfFunded: 15,
        fullyFunded: 10
      },
      availableSpots: 250,
      registeredCount: 180,
      description: "The first part of IYS 2026, focusing on leadership foundations and global networking."
    },
    {
      id: "iys-2026-part2", 
      partNumber: 2,
      title: "Istanbul Youth Summit 2026 - Part 2",
      duration: "4 days",
      startDate: "Aug 15, 2026",
      endDate: "Aug 18, 2026",
      targetDate: "2026-08-15T09:00:00", 
      registrationStart: "2026-01-01T00:00:00",
      registrationEnd: "2026-06-30T23:59:59",
      status: 'upcoming',
      price: {
        selfFunded: 15,
        fullyFunded: 10
      },
      availableSpots: 250,
      registeredCount: 0,
      description: "The second part of IYS 2026, focusing on advanced leadership skills and project implementation."
    }
  ];

  // Get the currently featured program (next registration open or upcoming)
  const featuredProgram = programParts.find(p => p.status === 'registration_open') || 
                         programParts.find(p => p.status === 'upcoming') || 
                         programParts[0];

  const benefits = [
    {
      icon: "ri-global-line",
      title: "Global Insights",
      description: "Attend impactful sessions led by global leaders and innovators addressing today's most pressing challenges."
    },
    {
      icon: "ri-lightbulb-line",
      title: "Leadership Development", 
      description: "Join leadership forums designed to sharpen critical thinking and equip you to become an effective changemaker."
    },
    {
      icon: "ri-team-line",
      title: "Cross-Cultural Collaboration",
      description: "Work alongside youth from various countries to co-create innovative solutions for global communities."
    },
    {
      icon: "ri-network-line",
      title: "Global Network",
      description: "Connect with influential individuals and youth leaders, building lasting relationships through shared goals."
    }
  ];

  return (
    <PublicLayout>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      {/* 1. Hero Banner - Just Image */}
      <section className="hero-enhanced">
        <div className="container">
          <div className="row align-items-center justify-content-center text-center">
            <div className="col-lg-12">
              <div className="hero-content fade-in-up">
                <h1 className="hero-title display-3 fw-bold text-white mb-4">
                  {programInfo.title} {programInfo.year}
                </h1>
                <p className="hero-subtitle h3 text-white mb-0 opacity-90">
                  {programInfo.subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Current Program Preview with Countdown */}
      <section className="py-5 position-relative" style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        overflow: 'hidden'
      }}>

        
        <div className="container position-relative" style={{ zIndex: 2 }}>
          {/* Countdown Timer at Top */}
          <div className="text-center mb-5">
            <h3 className="fw-bold text-dark mb-3">
              <i className="ri-timer-line me-2 text-primary"></i>
              Event Starts In
            </h3>
            <div className="d-inline-block">
              <CountdownTimer 
                targetDate={featuredProgram.targetDate}
                size="lg"
              />
            </div>
          </div>
          
          {/* Program Content without Card */}
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="position-relative">
                {/* Program Status Badges */}
                <div className="mb-3 d-flex flex-wrap gap-2">
                  <span className="badge bg-gradient-primary text-white px-3 py-2 rounded-pill">
                    <i className="ri-star-fill me-1"></i>
                    {featuredProgram.status === 'registration_open' ? 'FEATURED' : 'UPCOMING'}
                  </span>
                  <span className="badge bg-success px-3 py-2 rounded-pill">
                    <i className="ri-calendar-event-line me-1"></i>
                    {featuredProgram.status === 'registration_open' ? 'Registration Open' : 'Coming Soon'}
                  </span>
                  <span className="badge bg-gradient-warning text-dark px-3 py-2 rounded-pill">
                    <i className="ri-trophy-line me-1"></i>
                    Award-Winning
                  </span>
                  <span className="badge bg-gradient-info text-white px-3 py-2 rounded-pill">
                    <i className="ri-global-line me-1"></i>
                    International
                  </span>
                </div>
                
                <h1 className="display-5 fw-bold mb-4">{featuredProgram.title}</h1>
                <p className="lead text-muted mb-4">{programInfo.description}</p>
                
                {/* Program Details */}
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className="d-flex align-items-center p-3 bg-white rounded-3 shadow-sm">
                      <i className="ri-map-pin-line text-primary fs-4 me-2"></i>
                      <div>
                        <small className="text-muted d-block">Location</small>
                        <strong>{programInfo.location}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-center p-3 bg-white rounded-3 shadow-sm">
                      <i className="ri-calendar-line text-success fs-4 me-2"></i>
                      <div>
                        <small className="text-muted d-block">Dates</small>
                        <strong>{featuredProgram.startDate} - {featuredProgram.endDate}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-center p-3 bg-white rounded-3 shadow-sm">
                      <i className="ri-time-line text-info fs-4 me-2"></i>
                      <div>
                        <small className="text-muted d-block">Duration</small>
                        <strong>{featuredProgram.duration}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration Options */}
                <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
                  <h5 className="fw-bold mb-3 d-flex align-items-center">
                    <i className="ri-price-tag-3-line text-primary me-2"></i>
                    Registration Options
                  </h5>
                  <Row className="g-3">
                    <Col sm={6}>
                      <div className="text-center p-3 bg-primary-subtle rounded-3 border">
                        <div className="fs-3 fw-bold text-primary">${featuredProgram.price.selfFunded}</div>
                        <div className="text-muted">Self Funded</div>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="text-center p-3 bg-success-subtle rounded-3 border position-relative">
                        <div className="badge bg-success position-absolute top-0 start-50 translate-middle">Most Popular</div>
                        <div className="fs-3 fw-bold text-success">${featuredProgram.price.fullyFunded}</div>
                        <div className="text-muted">Fully Funded</div>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-3 flex-wrap">
                  {featuredProgram.status === 'registration_open' ? (
                    <Link href={`/apply?program=${featuredProgram.id}`}>
                      <Button color="primary" size="lg" className="px-5 rounded-pill">
                        <i className="ri-calendar-line me-2"></i>
                        Register Now
                      </Button>
                    </Link>
                  ) : (
                    <Button color="primary" size="lg" className="px-5 rounded-pill" disabled>
                      <i className="ri-time-line me-2"></i>
                      Registration Opens Soon
                    </Button>
                  )}
                  <Button color="outline-primary" size="lg" className="px-4 rounded-pill">
                    <i className="ri-information-line me-2"></i>
                    Learn More
                  </Button>
                </div>
              </div>
            </Col>
            
            <Col lg={6}>
              <div className="position-relative">
                <div className="bg-white p-4 rounded-4 shadow-lg">
                  <img 
                    src="https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg"
                    alt="Program participants"
                    className="img-fluid rounded-3 w-100"
                    style={{ height: "350px", objectFit: "cover" }}
                  />
                  
                  {/* Floating Stats */}
                  <div className="position-absolute bottom-0 start-0 end-0 p-3">
                    <div className="bg-white bg-opacity-95 rounded-3 p-3">
                      <Row className="g-3 text-center">
                        <Col xs={4}>
                          <div className="text-primary fw-bold fs-5">500+</div>
                          <small className="text-muted">Participants</small>
                        </Col>
                        <Col xs={4}>
                          <div className="text-success fw-bold fs-5">50+</div>
                          <small className="text-muted">Countries</small>
                        </Col>
                        <Col xs={4}>
                          <div className="text-warning fw-bold fs-5">6th</div>
                          <small className="text-muted">Edition</small>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
                
                {/* Additional Badges */}
                <div className="position-absolute top-0 end-0 m-3">
                  <div className="badge bg-gradient-success px-3 py-2 rounded-pill">
                    <i className="ri-verified-badge-line me-1"></i>
                    Verified Program
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          
          {/* See All Programs Button */}
          <div className="text-center mt-5">
            <Link href="/programs" className="btn btn-outline-primary btn-lg px-5 rounded-pill">
              <i className="ri-calendar-todo-line me-2"></i>
              Explore All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* 3. General Information - About, Benefits, Vision */}
      <Section background="light" padding="xl">
        <Row className="align-items-center mb-5">
          <Col lg={6}>
            <div className="fade-in-left">
              <h2 className="display-6 fw-bold mb-4">About Istanbul Youth Summit</h2>
              <p className="lead mb-4">
                A premier international platform that empowers young leaders to address global 
                challenges through innovation, collaboration, and transformative leadership.
              </p>
              <p className="text-muted mb-4">
                More than just a gathering, IYS is a space where ideas come to life. Through 
                inspiring talks, interactive sessions, and meaningful group activities, participants 
                are encouraged to explore new perspectives, grow as leaders, and connect with 
                youth from around the world.
              </p>
              <div className="program-highlights">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                    <i className="ri-trophy-line text-primary fs-4"></i>
                  </div>
                  <div>
                    <h5 className="mb-1">Social Project Competition</h5>
                    <p className="text-muted mb-0">Turn your innovative ideas into real-world impact</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success bg-opacity-10 p-3 rounded me-3">
                    <i className="ri-certificate-line text-success fs-4"></i>
                  </div>
                  <div>
                    <h5 className="mb-1">Official Recognition</h5>
                    <p className="text-muted mb-0">Receive certificates and awards for outstanding contributions</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="fade-in-right">
              <img 
                src="https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg" 
                alt="Program participants" 
                className="img-fluid rounded shadow"
              />
            </div>
          </Col>
        </Row>

        {/* Vision & Mission */}
        <Row className="mb-5">
          <Col lg={6}>
            <div className="card h-100 text-center p-4 material-shadow">
              <div className="card-body">
                <div className="bg-primary bg-opacity-10 p-4 rounded-circle d-inline-flex mb-4">
                  <i className="ri-eye-line text-primary fs-1"></i>
                </div>
                <h4 className="fw-bold mb-3">Our Vision</h4>
                <p className="text-muted">
                  To create a global community of empowered youth leaders who drive positive 
                  change in their communities and beyond through collaborative innovation and 
                  transformative leadership.
                </p>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="card h-100 text-center p-4 material-shadow">
              <div className="card-body">
                <div className="bg-success bg-opacity-10 p-4 rounded-circle d-inline-flex mb-4">
                  <i className="ri-target-line text-success fs-1"></i>
                </div>
                <h4 className="fw-bold mb-3">Our Mission</h4>
                <p className="text-muted">
                  To provide young leaders with the platform, tools, and network needed to 
                  address global challenges, fostering cross-cultural understanding and 
                  collaborative solutions for a better world.
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Benefits */}
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">What You'll Gain</h2>
          <p className="lead text-muted">Transformative benefits for your personal and professional growth</p>
        </div>
        <Row className="g-4">
          {benefits.map((benefit, index) => (
            <Col key={index} md={6} lg={3}>
              <div className="text-center fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="bg-primary bg-opacity-10 p-4 rounded-circle d-inline-flex mb-3">
                  <i className={`${benefit.icon} text-primary fs-1`}></i>
                </div>
                <h4 className="h5 mb-3">{benefit.title}</h4>
                <p className="text-muted">{benefit.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Section>

      {/* 4. Introduction Video */}
      <Section background="white" padding="xl">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">Experience IYS</h2>
          <p className="lead text-muted">Watch our introduction video to learn more about the program</p>
        </div>
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="position-relative">
              <div className="ratio ratio-16x9 rounded overflow-hidden shadow-lg">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Istanbul Youth Summit Introduction"
                  allowFullScreen
                  className="rounded"
                ></iframe>
              </div>
            </div>
          </Col>
        </Row>
      </Section>

      {/* 5. Gallery Preview */}
      <Section background="light" padding="xl">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">Gallery Highlights</h2>
          <p className="lead text-muted">Moments from our previous summits</p>
        </div>
        <Row className="g-3">
          <Col lg={4} md={6}>
            <div className="gallery-item position-relative overflow-hidden rounded">
              <img 
                src="https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg"
                alt="Gallery 1"
                className="img-fluid w-100"
                style={{ height: "250px", objectFit: "cover" }}
              />
              <div className="gallery-overlay position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center opacity-0">
                <i className="ri-eye-line text-white fs-2"></i>
              </div>
            </div>
          </Col>
          <Col lg={4} md={6}>
            <div className="gallery-item position-relative overflow-hidden rounded">
              <img 
                src="https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg"
                alt="Gallery 2"
                className="img-fluid w-100"
                style={{ height: "250px", objectFit: "cover" }}
              />
              <div className="gallery-overlay position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center opacity-0">
                <i className="ri-eye-line text-white fs-2"></i>
              </div>
            </div>
          </Col>
          <Col lg={4} md={6}>
            <div className="gallery-item position-relative overflow-hidden rounded">
              <img 
                src="https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg"
                alt="Gallery 3"
                className="img-fluid w-100"
                style={{ height: "250px", objectFit: "cover" }}
              />
              <div className="gallery-overlay position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center opacity-0">
                <i className="ri-eye-line text-white fs-2"></i>
              </div>
            </div>
          </Col>
          <Col lg={4} md={6}>
            <div className="gallery-item position-relative overflow-hidden rounded">
              <img 
                src="https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg"
                alt="Gallery 4"
                className="img-fluid w-100"
                style={{ height: "250px", objectFit: "cover" }}
              />
              <div className="gallery-overlay position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center opacity-0">
                <i className="ri-eye-line text-white fs-2"></i>
              </div>
            </div>
          </Col>
          <Col lg={4} md={6}>
            <div className="gallery-item position-relative overflow-hidden rounded">
              <img 
                src="https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg"
                alt="Gallery 5"
                className="img-fluid w-100"
                style={{ height: "250px", objectFit: "cover" }}
              />
              <div className="gallery-overlay position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center opacity-0">
                <i className="ri-eye-line text-white fs-2"></i>
              </div>
            </div>
          </Col>
          <Col lg={4} md={6}>
            <div className="gallery-item position-relative overflow-hidden rounded">
              <img 
                src="https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg"
                alt="Gallery 6"
                className="img-fluid w-100"
                style={{ height: "250px", objectFit: "cover" }}
              />
              <div className="gallery-overlay position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center opacity-0">
                <i className="ri-eye-line text-white fs-2"></i>
              </div>
            </div>
          </Col>
        </Row>
        <div className="text-center mt-4">
          <Link href="/gallery" className="btn btn-primary btn-lg">
            <i className="ri-gallery-line me-2"></i>
            View Full Gallery
          </Link>
        </div>
      </Section>

      {/* 6. Testimonials Preview */}
      <Section background="white" padding="xl">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">What Participants Say</h2>
          <p className="lead text-muted">Stories from our global community of youth leaders</p>
        </div>
        
        {/* Text Testimonials */}
        <Row className="g-4 mb-5">
          <Col lg={4}>
            <div className="card h-100 border-0 material-shadow">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <i className="ri-double-quotes-l text-primary fs-2"></i>
                </div>
                <p className="text-muted mb-4">
                  "IYS transformed my perspective on leadership and gave me the confidence to 
                  start my own social impact project. The connections I made are invaluable."
                </p>
                <div className="d-flex align-items-center justify-content-center">
                  <img 
                    src="/images/users/avatar-1.jpg" 
                    alt="Testimonial" 
                    className="rounded-circle me-3"
                    width="50"
                    height="50"
                  />
                  <div className="text-start">
                    <h6 className="mb-1">Sarah Johnson</h6>
                    <small className="text-muted">IYS 2024 Participant</small>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={4}>
            <div className="card h-100 border-0 material-shadow">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <i className="ri-double-quotes-l text-primary fs-2"></i>
                </div>
                <p className="text-muted mb-4">
                  "The cultural exchange and collaborative projects opened my eyes to global 
                  perspectives. I'm still working with teammates I met at the summit."
                </p>
                <div className="d-flex align-items-center justify-content-center">
                  <img 
                    src="/images/users/avatar-2.jpg" 
                    alt="Testimonial" 
                    className="rounded-circle me-3"
                    width="50"
                    height="50"
                  />
                  <div className="text-start">
                    <h6 className="mb-1">Ahmed Hassan</h6>
                    <small className="text-muted">IYS 2023 Participant</small>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={4}>
            <div className="card h-100 border-0 material-shadow">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <i className="ri-double-quotes-l text-primary fs-2"></i>
                </div>
                <p className="text-muted mb-4">
                  "IYS provided the perfect platform to showcase our ideas and receive mentorship 
                  from industry experts. It was truly life-changing."
                </p>
                <div className="d-flex align-items-center justify-content-center">
                  <img 
                    src="/images/users/avatar-3.jpg" 
                    alt="Testimonial" 
                    className="rounded-circle me-3"
                    width="50"
                    height="50"
                  />
                  <div className="text-start">
                    <h6 className="mb-1">Maria Rodriguez</h6>
                    <small className="text-muted">IYS 2024 Participant</small>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Video Testimonials */}
        <div className="text-center mb-4">
          <h3 className="fw-bold">Video Testimonials</h3>
          <p className="text-muted">Hear directly from our participants</p>
        </div>
        <Row className="g-4">
          <Col lg={4}>
            <div className="position-relative">
              <div className="ratio ratio-16x9 rounded overflow-hidden">
                <img 
                  src="https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg"
                  alt="Video Testimonial 1"
                  className="img-fluid"
                  style={{ objectFit: "cover" }}
                />
                <div className="position-absolute top-50 start-50 translate-middle">
                  <button className="btn btn-primary btn-lg rounded-circle p-3">
                    <i className="ri-play-fill fs-4"></i>
                  </button>
                </div>
              </div>
              <div className="mt-3 text-center">
                <h6 className="mb-1">Emma Thompson</h6>
                <small className="text-muted">UK Participant</small>
              </div>
            </div>
          </Col>
          <Col lg={4}>
            <div className="position-relative">
              <div className="ratio ratio-16x9 rounded overflow-hidden">
                <img 
                  src="https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg"
                  alt="Video Testimonial 2"
                  className="img-fluid"
                  style={{ objectFit: "cover" }}
                />
                <div className="position-absolute top-50 start-50 translate-middle">
                  <button className="btn btn-primary btn-lg rounded-circle p-3">
                    <i className="ri-play-fill fs-4"></i>
                  </button>
                </div>
              </div>
              <div className="mt-3 text-center">
                <h6 className="mb-1">David Chen</h6>
                <small className="text-muted">Singapore Participant</small>
              </div>
            </div>
          </Col>
          <Col lg={4}>
            <div className="position-relative">
              <div className="ratio ratio-16x9 rounded overflow-hidden">
                <img 
                  src="https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg"
                  alt="Video Testimonial 3"
                  className="img-fluid"
                  style={{ objectFit: "cover" }}
                />
                <div className="position-absolute top-50 start-50 translate-middle">
                  <button className="btn btn-primary btn-lg rounded-circle p-3">
                    <i className="ri-play-fill fs-4"></i>
                  </button>
                </div>
              </div>
              <div className="mt-3 text-center">
                <h6 className="mb-1">Fatima Al-Zahra</h6>
                <small className="text-muted">Morocco Participant</small>
              </div>
            </div>
          </Col>
        </Row>
        
        <div className="text-center mt-5">
          <Link href="/testimonials" className="btn btn-outline-primary btn-lg">
            <i className="ri-chat-quote-line me-2"></i>
            View All Testimonials
          </Link>
        </div>
      </Section>

      {/* Call to Action */}
      <Section background="gradient" padding="xl">
        <div className="text-center text-white">
          <h2 className="display-6 fw-bold mb-4">Ready to Transform Your Future?</h2>
          <p className="lead mb-5 opacity-75">
            Join hundreds of young leaders from around the world in this life-changing experience.
          </p>
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            <Link href="/apply" className="btn btn-light btn-lg px-5">
              <i className="ri-calendar-line me-2"></i>
              Apply Now
            </Link>
            <Link href="/programs" className="btn btn-outline-light btn-lg px-5">
              <i className="ri-search-line me-2"></i>
              Explore Programs
            </Link>
          </div>
        </div>
      </Section>
    </PublicLayout>
  );
}
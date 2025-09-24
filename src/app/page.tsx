'use client';
import Link from "next/link";
import PublicLayout from "@/layouts/PublicLayout";
import { YBB_ROUTES } from "@/constants/ybb";
import CountdownTimer from "@/components/UI/CountdownTimer";
import StatCard from "@/components/UI/StatCard";
import ProgramCard from "@/components/UI/ProgramCard";
import Section from "@/components/UI/Section";
import { Button, Row, Col } from "reactstrap";

export default function Home() {
  // Mock data - in real app this would come from API
  const programData = {
    title: "Istanbul Youth Summit 2026",
    subtitle: "Collaboration in Diversity",
    description: "A premier international platform that empowers young leaders to address global challenges through innovation, collaboration, and transformative leadership.",
    duration: "4 days",
    startDate: "Feb 09, 2026",
    endDate: "Feb 12, 2026",
    targetDate: "2026-02-09T09:00:00",
    location: "Istanbul, Turkey",
    price: {
      selfFunded: 15,
      fullyFunded: 10
    },
    registrationStatus: 'open' as const
  };

  const stats = [
    { icon: "ri-group-line", number: "500+", label: "Global Participants", color: "primary" as const },
    { icon: "ri-earth-line", number: "50+", label: "Countries", color: "success" as const },
    { icon: "ri-award-line", number: "25+", label: "Awards Given", color: "warning" as const },
    { icon: "ri-calendar-event-line", number: "6", label: "Years Running", color: "info" as const }
  ];

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
      {/* Enhanced Hero Section */}
      <section className="hero-enhanced">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="hero-content fade-in-left">
                <h1 className="hero-title">
                  {programData.title}
                </h1>
                <p className="hero-subtitle mb-4">
                  {programData.subtitle} • {programData.location}
                </p>
                <p className="mb-4 opacity-75">
                  {programData.description}
                </p>
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <Link href="/apply">
                  <Button color="light" size="lg" className="px-4">
                    <i className="ri-calendar-line me-2"></i>
                    Register Now
                  </Button>
                </Link>
                  <Button color="outline-light" size="lg" className="px-4">
                    <i className="ri-information-line me-2"></i>
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="text-center fade-in-right">
                <div className="mb-4">
                  <h4 className="text-white mb-3">Event Starts In</h4>
                  <CountdownTimer 
                    targetDate={programData.targetDate}
                    size="md"
                  />
                </div>
                <div className="hero-info bg-white bg-opacity-10 rounded p-4 backdrop-filter">
                  <div className="row text-center">
                    <div className="col-4">
                      <div className="mb-2">
                        <i className="ri-time-line fs-4"></i>
                      </div>
                      <div className="small">Duration</div>
                      <div className="fw-bold">{programData.duration}</div>
                    </div>
                    <div className="col-4">
                      <div className="mb-2">
                        <i className="ri-calendar-line fs-4"></i>
                      </div>
                      <div className="small">Date</div>
                      <div className="fw-bold">{programData.startDate}</div>
                    </div>
                    <div className="col-4">
                      <div className="mb-2">
                        <i className="ri-map-pin-line fs-4"></i>
                      </div>
                      <div className="small">Location</div>
                      <div className="fw-bold">{programData.location}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <Section background="light" padding="lg">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">Our Impact in Numbers</h2>
          <p className="lead text-muted">Join a global community of young changemakers</p>
        </div>
        <Row className="g-4">
          {stats.map((stat, index) => (
            <Col key={index} lg={3} md={6}>
              <div className="fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <StatCard {...stat} />
              </div>
            </Col>
          ))}
        </Row>
      </Section>

      {/* About Program Section */}
      <Section id="about" padding="xl">
        <Row className="align-items-center">
          <Col lg={6}>
            <div className="fade-in-left">
              <h2 className="display-6 fw-bold mb-4">About Our Program</h2>
              <p className="lead mb-4">
                The Istanbul Youth Summit (IYS) is a premier international platform that empowers 
                young leaders to address global challenges through innovation, collaboration, and 
                transformative leadership.
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
      </Section>

      {/* Benefits Section */}
      <Section background="light" padding="xl">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">Delegate Benefits</h2>
          <p className="lead text-muted">What you'll gain from this transformative experience</p>
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

      {/* Registration Section */}
      <Section background="gradient" padding="xl">
        <div className="text-center text-white">
          <h2 className="display-6 fw-bold mb-4">Registration Options</h2>
          <p className="lead mb-5 opacity-75">Choose the option that works best for you</p>
          
          <Row className="justify-content-center">
            <Col lg={5} md={6} className="mb-4">
              <div className="bg-white bg-opacity-10 p-4 rounded">
                <h4 className="text-white mb-3">Self Funded</h4>
                <div className="display-4 text-white mb-3">${programData.price.selfFunded}</div>
                <p className="text-white-75 mb-4">Registration Fee - Self Funded</p>
                <p className="small text-white-75 mb-4">Oct 03, 2025 - Dec 31, 2025</p>
                <Button color="light" size="lg" className="w-100" disabled>
                  Registration Closed
                </Button>
              </div>
            </Col>
            <Col lg={5} md={6} className="mb-4">
              <div className="bg-white bg-opacity-20 p-4 rounded border border-light">
                <div className="badge bg-success mb-3">Available</div>
                <h4 className="text-white mb-3">Fully Funded</h4>
                <div className="display-4 text-white mb-3">${programData.price.fullyFunded}</div>
                <p className="text-white-75 mb-4">Registration Fee for Fully Funded</p>
                <p className="small text-white-75 mb-4">Aug 06, 2025 - Oct 02, 2025</p>
                <Link href="/apply?type=fully-funded">
                  <Button color="light" size="lg" className="w-100 mb-2">
                    Register as Fully Funded
                  </Button>
                </Link>
                <Button color="outline-light" size="sm" className="w-100">
                  View Details
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </Section>

      {/* Call to Action Section */}
      <Section padding="xl">
        <div className="text-center">
          <h2 className="display-6 fw-bold mb-4">Ready to Transform Your Future?</h2>
          <p className="lead text-muted mb-5">
            Join hundreds of young leaders from around the world in this life-changing experience.
          </p>
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            <Link href={YBB_ROUTES.PROGRAMS} className="btn btn-primary btn-lg px-5">
              <i className="ri-search-line me-2"></i>
              Explore Programs
            </Link>
            <Link href={YBB_ROUTES.AUTH.REGISTER} className="btn btn-outline-primary btn-lg px-5">
              <i className="ri-user-add-line me-2"></i>
              Get Started
            </Link>
          </div>
        </div>
      </Section>
    </PublicLayout>
  );
}

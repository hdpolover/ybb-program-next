import PublicLayout from "@/layouts/PublicLayout";
import { Container, Row, Col } from "reactstrap";

export default function PartnersPage() {
  return (
    <PublicLayout>
      <section className="section">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mb-5">
                <h2 className="mb-3 fw-semibold">Our Partners & Sponsors</h2>
                <p className="text-muted mb-4">
                  We're proud to work with industry leaders who support young entrepreneurs worldwide.
                </p>
              </div>
            </Col>
          </Row>
          
          {/* Gold Partners */}
          <Row className="mb-5">
            <Col lg={12}>
              <h4 className="text-center mb-4">Gold Partners</h4>
            </Col>
            <Col md={4} className="mb-4">
              <div className="card text-center h-100 border-warning">
                <div className="card-body d-flex flex-column">
                  <div className="mb-3">
                    <div className="avatar-lg mx-auto">
                      <div className="avatar-title bg-warning-subtle text-warning rounded-circle fs-24">
                        <i className="ri-building-line"></i>
                      </div>
                    </div>
                  </div>
                  <h5 className="card-title">TechCorp Solutions</h5>
                  <p className="card-text text-muted flex-grow-1">
                    Leading technology partner providing mentorship and technical resources to our participants.
                  </p>
                  <span className="badge bg-warning text-dark">Gold Sponsor</span>
                </div>
              </div>
            </Col>
            
            <Col md={4} className="mb-4">
              <div className="card text-center h-100 border-warning">
                <div className="card-body d-flex flex-column">
                  <div className="mb-3">
                    <div className="avatar-lg mx-auto">
                      <div className="avatar-title bg-warning-subtle text-warning rounded-circle fs-24">
                        <i className="ri-bank-line"></i>
                      </div>
                    </div>
                  </div>
                  <h5 className="card-title">Global Finance Bank</h5>
                  <p className="card-text text-muted flex-grow-1">
                    Financial partner offering startup loans and financial literacy programs.
                  </p>
                  <span className="badge bg-warning text-dark">Gold Sponsor</span>
                </div>
              </div>
            </Col>
            
            <Col md={4} className="mb-4">
              <div className="card text-center h-100 border-warning">
                <div className="card-body d-flex flex-column">
                  <div className="mb-3">
                    <div className="avatar-lg mx-auto">
                      <div className="avatar-title bg-warning-subtle text-warning rounded-circle fs-24">
                        <i className="ri-global-line"></i>
                      </div>
                    </div>
                  </div>
                  <h5 className="card-title">Innovation Ventures</h5>
                  <p className="card-text text-muted flex-grow-1">
                    Venture capital firm providing seed funding and investor networking opportunities.
                  </p>
                  <span className="badge bg-warning text-dark">Gold Sponsor</span>
                </div>
              </div>
            </Col>
          </Row>
          
          {/* Silver Partners */}
          <Row className="mb-5">
            <Col lg={12}>
              <h4 className="text-center mb-4">Silver Partners</h4>
            </Col>
            <Col md={6} lg={3} className="mb-3">
              <div className="card text-center h-100">
                <div className="card-body">
                  <div className="avatar-md mx-auto mb-3">
                    <div className="avatar-title bg-secondary-subtle text-secondary rounded-circle">
                      <i className="ri-computer-line"></i>
                    </div>
                  </div>
                  <h6 className="card-title">DevTools Inc</h6>
                  <span className="badge bg-secondary">Silver</span>
                </div>
              </div>
            </Col>
            
            <Col md={6} lg={3} className="mb-3">
              <div className="card text-center h-100">
                <div className="card-body">
                  <div className="avatar-md mx-auto mb-3">
                    <div className="avatar-title bg-secondary-subtle text-secondary rounded-circle">
                      <i className="ri-lightbulb-line"></i>
                    </div>
                  </div>
                  <h6 className="card-title">Creative Studios</h6>
                  <span className="badge bg-secondary">Silver</span>
                </div>
              </div>
            </Col>
            
            <Col md={6} lg={3} className="mb-3">
              <div className="card text-center h-100">
                <div className="card-body">
                  <div className="avatar-md mx-auto mb-3">
                    <div className="avatar-title bg-secondary-subtle text-secondary rounded-circle">
                      <i className="ri-rocket-line"></i>
                    </div>
                  </div>
                  <h6 className="card-title">Startup Hub</h6>
                  <span className="badge bg-secondary">Silver</span>
                </div>
              </div>
            </Col>
            
            <Col md={6} lg={3} className="mb-3">
              <div className="card text-center h-100">
                <div className="card-body">
                  <div className="avatar-md mx-auto mb-3">
                    <div className="avatar-title bg-secondary-subtle text-secondary rounded-circle">
                      <i className="ri-team-line"></i>
                    </div>
                  </div>
                  <h6 className="card-title">Mentor Network</h6>
                  <span className="badge bg-secondary">Silver</span>
                </div>
              </div>
            </Col>
          </Row>
          
          {/* Partnership CTA */}
          <Row>
            <Col lg={12}>
              <div className="card bg-primary">
                <div className="card-body text-center text-white">
                  <h5 className="text-white mb-3">Become a Partner</h5>
                  <p className="mb-4">
                    Join our mission to empower young entrepreneurs worldwide. 
                    Partner with us to make a lasting impact.
                  </p>
                  <a href="#" className="btn btn-light">
                    Learn More About Partnership
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </PublicLayout>
  );
}
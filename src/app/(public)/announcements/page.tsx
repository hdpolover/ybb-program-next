import PublicLayout from "@/layouts/PublicLayout";
import { Container, Row, Col } from "reactstrap";

export default function AnnouncementsPage() {
  return (
    <PublicLayout>
      <section className="section">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mb-5">
                <h2 className="mb-3 fw-semibold">Announcements</h2>
                <p className="text-muted mb-4">
                  Stay informed about the latest news, program updates, and important announcements.
                </p>
              </div>
            </Col>
          </Row>
          
          <Row className="g-4">
            <Col lg={12}>
              <div className="alert alert-primary" role="alert">
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <i className="ri-notification-2-line fs-20"></i>
                  </div>
                  <div>
                    <h6 className="alert-heading mb-1">New Program Launch: Digital Marketing Mastery</h6>
                    <p className="mb-0 small">
                      We're excited to announce our new 6-week Digital Marketing program starting January 2025. 
                      Applications open December 25, 2024.
                    </p>
                    <small className="text-muted">Posted: December 20, 2024</small>
                  </div>
                </div>
              </div>
            </Col>
            
            <Col lg={12}>
              <div className="alert alert-success" role="alert">
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <i className="ri-trophy-line fs-20"></i>
                  </div>
                  <div>
                    <h6 className="alert-heading mb-1">Congratulations to Our Q4 2024 Graduates!</h6>
                    <p className="mb-0 small">
                      We're proud to celebrate 150 young entrepreneurs who completed their programs this quarter. 
                      Together they launched 45 new businesses!
                    </p>
                    <small className="text-muted">Posted: December 15, 2024</small>
                  </div>
                </div>
              </div>
            </Col>
            
            <Col lg={12}>
              <div className="alert alert-warning" role="alert">
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <i className="ri-calendar-event-line fs-20"></i>
                  </div>
                  <div>
                    <h6 className="alert-heading mb-1">Holiday Schedule Update</h6>
                    <p className="mb-0 small">
                      Our offices will be closed from December 24-26, 2024 and January 1, 2025. 
                      Online programs will continue as scheduled.
                    </p>
                    <small className="text-muted">Posted: December 10, 2024</small>
                  </div>
                </div>
              </div>
            </Col>
            
            <Col lg={12}>
              <div className="alert alert-info" role="alert">
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <i className="ri-user-add-line fs-20"></i>
                  </div>
                  <div>
                    <h6 className="alert-heading mb-1">Ambassador Program Expansion</h6>
                    <p className="mb-0 small">
                      We're expanding our Ambassador program to include more regions. 
                      New opportunities available in Asia-Pacific and Latin America.
                    </p>
                    <small className="text-muted">Posted: December 5, 2024</small>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </PublicLayout>
  );
}
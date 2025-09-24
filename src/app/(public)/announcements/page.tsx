'use client';
import React, { useState } from 'react';
import PublicLayout from "@/layouts/PublicLayout";
import Section from '@/components/UI/Section';
import { Row, Col, Card, CardBody, Badge, Button } from "reactstrap";

const AnnouncementsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Mock data based on the website content
  const announcements = [
    {
      id: 1,
      title: "Eco-Friendly Waste Management: Building Sustainable and Impactful Social Projects",
      description: "Explore how eco-friendly waste management projects led by youth are creating long-term, sustainable impact. Learn how young changemakers are turning environmental challenges into powerful community solutions.",
      date: "Aug 19, 2025",
      image: "https://storage.ybbfoundation.com/program-announcements/10/image_1755573046.png",
      category: "Environmental",
      featured: true
    },
    {
      id: 2,
      title: "Be Proud, Be Loud: Share Your Twibbon for Istanbul Youth Summit 2026 Now!",
      description: "Show your support for Istanbul Youth Summit 2026 by creating and sharing your Twibbon. Join the global movement and let your network know you're part of this inspiring youth event.",
      date: "Aug 12, 2025",
      image: "https://storage.ybbfoundation.com/program-announcements/10/image_1755001246.png",
      category: "Campaign",
      featured: false
    },
    {
      id: 3,
      title: "Istanbul Youth Summit 2026 Officially Open for Global Youth Delegates!",
      description: "The Istanbul Youth Summit 2026 by Youth Break the Boundaries is officially open for global delegates. Join the 9th edition to present your social project, connect with youth leaders worldwide, and make a real impact.",
      date: "Aug 08, 2025",
      image: "https://storage.ybbfoundation.com/program-announcements/10/image_1754656930.jpg",
      category: "Registration",
      featured: true
    },
    {
      id: 4,
      title: "Why is Istanbul The Ideal City for The IYS 2026? Let's Break It Down!",
      description: "Discover why Istanbul is the ideal host city for the Istanbul Youth Summit 2026. Explore its rich history, cultural diversity, and strategic role bridging continents, making it the perfect place for emerging youth leaders to connect and innovate for a sustainable future.",
      date: "Jul 20, 2025",
      image: "https://storage.ybbfoundation.com/program-announcements/10/image_1753007150.png",
      category: "City Guide",
      featured: false
    },
    {
      id: 5,
      title: "Indonesian Trade Minister's Representative Highlight at Istanbul Youth Summit 2025",
      description: "At Istanbul Youth Summit 2025, Dyah Roro Esti emphasizes the role of youth in economic transformation through education, innovation, and global collaboration in key sectors.",
      date: "Jul 06, 2025",
      image: "https://storage.ybbfoundation.com/program-announcements/3/image_1751796675.png",
      category: "Speakers",
      featured: false
    },
    {
      id: 6,
      title: "Sana Dawari Highlights the Power of Volunteerism at Istanbul Youth Summit 2025",
      description: "At Istanbul Youth Summit 2025, former UN Volunteer Sana Dawari emphasized how volunteerism drives leadership, supports SDGs, and empowers youth to become global changemakers.",
      date: "Jul 06, 2025",
      image: "https://storage.ybbfoundation.com/program-announcements/3/image_1751796540.png",
      category: "Speakers",
      featured: false
    },
    {
      id: 7,
      title: "Meet the Winners of Istanbul Youth Summit 2025: Full Award List and Highlight Program",
      description: "IYS 2025 officially concludes in Istanbul, honoring youth leaders from 16 countries. Awards were given for best projects, presenters, and leaders committed to the Sustainable Development Goals (SDGs).",
      date: "Jul 06, 2025",
      image: "https://storage.ybbfoundation.com/program-announcements/3/image_1751796437.png",
      category: "Awards",
      featured: true
    },
    {
      id: 8,
      title: "Raditya Daneswara Wins Best Junior Male Participant at Istanbul Youth Summit 2025",
      description: "Raditya Daneswara, a student from MAN 2 Kota Malang, earned the title of Best Male Participant (Junior Category) at the Istanbul Youth Summit 2025 in Turkey, showcasing Indonesia's youth excellence on the global stage.",
      date: "Jul 06, 2025",
      image: "https://storage.ybbfoundation.com/program-announcements/3/image_1751796298.png",
      category: "Awards",
      featured: false
    }
  ];

  // Pagination
  const totalPages = Math.ceil(announcements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = announcements.slice(startIndex, startIndex + itemsPerPage);
  const featuredAnnouncements = announcements.filter(item => item.featured).slice(0, 2);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Environmental': 'success',
      'Campaign': 'info',
      'Registration': 'primary',
      'City Guide': 'warning',
      'Speakers': 'secondary',
      'Awards': 'danger'
    };
    return colors[category] || 'primary';
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <Section background="gradient" padding="lg" className="text-white text-center">
        <h1 className="display-5 fw-bold mb-3">Announcements</h1>
        <p className="lead mb-0">Stay updated with the latest news about our programs</p>
      </Section>

      {/* Featured Announcements */}
      <Section padding="lg">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">Featured News</h2>
          <p className="text-muted">Don't miss these important updates</p>
        </div>
        
        <Row className="g-4">
          {featuredAnnouncements.map((item) => (
            <Col key={item.id} lg={6}>
              <Card className="featured-announcement h-100 border-0 shadow">
                <div className="position-relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="card-img-top"
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                  <Badge color="danger" className="position-absolute top-0 start-0 m-3">
                    Featured
                  </Badge>
                </div>
                <CardBody className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Badge color={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                    <small className="text-muted">{item.date}</small>
                  </div>
                  <h4 className="card-title mb-3">{item.title}</h4>
                  <p className="text-muted mb-3">{item.description}</p>
                  <Button color="primary" size="sm">
                    <i className="ri-arrow-right-line me-1"></i>
                    Read More
                  </Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Section>

      {/* All Announcements */}
      <Section background="light" padding="xl">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">All Announcements</h2>
          <p className="text-muted">
            Showing {currentItems.length} of {announcements.length} announcements
          </p>
        </div>

        <Row className="g-4">
          {currentItems.map((item) => (
            <Col key={item.id} lg={6} className="mb-4">
              <Card className="announcement-card h-100 shadow-sm">
                <Row className="g-0">
                  <Col md={4}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="img-fluid w-100 h-100"
                      style={{ objectFit: 'cover', minHeight: '200px' }}
                    />
                  </Col>
                  <Col md={8}>
                    <CardBody className="p-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Badge color={getCategoryColor(item.category)} className="small">
                          {item.category}
                        </Badge>
                        <small className="text-muted">{item.date}</small>
                      </div>
                      <h6 className="card-title mb-2">{item.title}</h6>
                      <p className="card-text text-muted small mb-3">
                        {item.description.length > 120 
                          ? item.description.substring(0, 120) + '...' 
                          : item.description}
                      </p>
                      <Button color="outline-primary" size="sm">
                        Read More
                      </Button>
                    </CardBody>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-5">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </Section>

      {/* Newsletter CTA */}
      <Section background="primary" padding="lg" className="text-white text-center">
        <h3 className="mb-3">Never miss an update!</h3>
        <p className="lead mb-4">Subscribe to our newsletter to receive the latest news directly in your inbox.</p>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email address"
              />
              <button className="btn btn-light" type="button">
                <i className="ri-send-plane-line me-2"></i>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </Section>
    </PublicLayout>
  );
};

export default AnnouncementsPage;
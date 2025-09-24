'use client';
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Badge, Button, Form, Input, InputGroup } from 'reactstrap';

interface Testimonial {
  id: number;
  name: string;
  country: string;
  year: string;
  program: string;
  testimonial: string;
  image?: string;
  role?: string;
  award?: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  showFilters?: boolean;
  itemsPerPage?: number;
  layout?: 'grid' | 'carousel';
  className?: string;
}

const Testimonials: React.FC<TestimonialsProps> = ({
  testimonials,
  title = "Voices of Success: Our Community Speaks",
  subtitle = "Real stories from participants who've experienced transformational results with our program",
  showSearch = true,
  showFilters = true,
  itemsPerPage = 6,
  layout = 'grid',
  className = ''
}) => {
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>(testimonials);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // Get unique countries and years
  const countries = ['all', ...Array.from(new Set(testimonials.map(item => item.country))).sort()];
  const years = ['all', ...Array.from(new Set(testimonials.map(item => item.year))).sort().reverse()];

  // Filter testimonials
  useEffect(() => {
    let filtered = testimonials;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.testimonial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.program.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Country filter
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(item => item.country === selectedCountry);
    }

    // Year filter
    if (selectedYear !== 'all') {
      filtered = filtered.filter(item => item.year === selectedYear);
    }

    setFilteredTestimonials(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCountry, selectedYear, testimonials]);

  // Pagination
  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredTestimonials.slice(startIndex, startIndex + itemsPerPage);

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className={`testimonials-section ${className}`}>
      {/* Header */}
      {title && (
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">{title}</h2>
          {subtitle && <p className="lead text-muted">{subtitle}</p>}
        </div>
      )}

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="testimonials-controls mb-5">
          {showSearch && (
            <Row className="mb-3">
              <Col lg={6} className="mx-auto">
                <InputGroup>
                  <Input
                    type="text"
                    placeholder="Search testimonials by name, country, or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button color="primary" outline>
                    <i className="ri-search-line"></i>
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          )}

          {showFilters && (
            <Row className="align-items-center justify-content-center">
              <Col md={4}>
                <div className="d-flex flex-wrap gap-2 align-items-center justify-content-center">
                  <span className="fw-bold me-2">Country:</span>
                  <select
                    className="form-select form-select-sm w-auto"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                  >
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country === 'all' ? 'All Countries' : country}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>
              <Col md={4}>
                <div className="d-flex flex-wrap gap-2 align-items-center justify-content-center">
                  <span className="fw-bold me-2">Year:</span>
                  <select
                    className="form-select form-select-sm w-auto"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year === 'all' ? 'All Years' : year}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>
            </Row>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="mb-4">
        <p className="text-muted text-center">
          Showing {currentItems.length} of {filteredTestimonials.length} testimonials
          {searchTerm || selectedCountry !== 'all' || selectedYear !== 'all' ? 
            ` (filtered from ${testimonials.length} total)` : ''}
        </p>
      </div>

      {/* Testimonials Grid */}
      <Row className="g-4">
        {currentItems.map((testimonial) => {
          const isExpanded = expandedItems.has(testimonial.id);
          const shouldShowReadMore = testimonial.testimonial.length > 150;

          return (
            <Col key={testimonial.id} lg={4} md={6}>
              <Card className="testimonial-card h-100 shadow-sm">
                <CardBody className="p-4">
                  {/* Header */}
                  <div className="d-flex align-items-center mb-3">
                    {testimonial.image ? (
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="rounded-circle me-3"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: '60px', height: '60px' }}
                      >
                        <i className="ri-user-line text-primary fs-4"></i>
                      </div>
                    )}
                    <div>
                      <h6 className="mb-1">{testimonial.name}</h6>
                      <div className="d-flex flex-wrap gap-2">
                        <Badge color="primary" className="small">
                          <i className="ri-map-pin-line me-1"></i>
                          {testimonial.country}
                        </Badge>
                        <Badge color="success" className="small">
                          {testimonial.year}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Award */}
                  {testimonial.award && (
                    <div className="mb-3">
                      <Badge color="warning" className="mb-2">
                        <i className="ri-award-line me-1"></i>
                        {testimonial.award}
                      </Badge>
                    </div>
                  )}

                  {/* Testimonial Text */}
                  <div className="testimonial-content">
                    <p className="text-muted mb-3 lh-lg">
                      "{isExpanded ? testimonial.testimonial : truncateText(testimonial.testimonial)}"
                    </p>
                    
                    {shouldShowReadMore && (
                      <Button
                        color="link"
                        size="sm"
                        className="p-0 text-decoration-none"
                        onClick={() => toggleExpanded(testimonial.id)}
                      >
                        {isExpanded ? 'Read Less' : 'Read Full Testimonial'}
                        <i className={`ri-arrow-${isExpanded ? 'up' : 'down'}-s-line ms-1`}></i>
                      </Button>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="testimonial-footer mt-auto pt-3 border-top">
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Participant of {testimonial.program}
                      </small>
                      <div className="testimonial-rating">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="ri-star-fill text-warning small"></i>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* No results message */}
      {currentItems.length === 0 && (
        <div className="text-center py-5">
          <i className="ri-search-line text-muted" style={{ fontSize: '3rem' }}></i>
          <h5 className="text-muted mt-3">No testimonials found</h5>
          <p className="text-muted">Try adjusting your search criteria or filters.</p>
          <Button 
            color="primary" 
            onClick={() => {
              setSearchTerm('');
              setSelectedCountry('all');
              setSelectedYear('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

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
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                
                return (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                );
              })}
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
    </div>
  );
};

export default Testimonials;
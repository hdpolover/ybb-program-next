'use client';
import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import Section from '@/components/UI/Section';

const PartnersSponsorsPage: React.FC = () => {
  // Sample partners and sponsors data
  const diamondSponsors = [
    {
      id: 1,
      name: "Global Innovation Foundation",
      logo: "https://via.placeholder.com/200x100/0d6efd/ffffff?text=Global+Innovation+Foundation",
      website: "https://example.com",
      contribution: "Primary Program Funding & Strategic Partnership",
      description: "Leading global foundation supporting youth innovation and entrepreneurship worldwide through comprehensive funding and mentorship programs.",
      yearStarted: "2020"
    }
  ];

  const goldSponsors = [
    {
      id: 2,
      name: "Future Leaders Institute",
      logo: "https://via.placeholder.com/180x90/ffc107/000000?text=Future+Leaders+Institute",
      website: "https://example.com",
      contribution: "Scholarship Fund & Training Programs",
      yearStarted: "2021"
    },
    {
      id: 3,
      name: "International Development Bank", 
      logo: "https://via.placeholder.com/180x90/ffc107/000000?text=International+Development+Bank",
      website: "https://example.com",
      contribution: "Workshop Facilities & Technology Infrastructure",
      yearStarted: "2021"
    }
  ];

  const silverSponsors = [
    {
      id: 4,
      name: "TechCorp Solutions",
      logo: "https://via.placeholder.com/160x80/6c757d/ffffff?text=TechCorp+Solutions",
      website: "https://example.com",
      contribution: "Technology Support"
    },
    {
      id: 5,
      name: "Education Partners Ltd",
      logo: "https://via.placeholder.com/160x80/6c757d/ffffff?text=Education+Partners",
      website: "https://example.com",
      contribution: "Educational Resources"
    },
    {
      id: 6,
      name: "Youth Development Network",
      logo: "https://via.placeholder.com/160x80/6c757d/ffffff?text=Youth+Development+Network",
      website: "https://example.com",
      contribution: "Networking & Mentorship"
    }
  ];

  const communityPartners = [
    {
      id: 7,
      name: "Local Youth Council",
      logo: "https://via.placeholder.com/140x70/28a745/ffffff?text=Local+Youth+Council",
      type: "Community Partner"
    },
    {
      id: 8,
      name: "University Alliance",
      logo: "https://via.placeholder.com/140x70/28a745/ffffff?text=University+Alliance",
      type: "Academic Partner"
    },
    {
      id: 9,
      name: "Social Impact Hub",
      logo: "https://via.placeholder.com/140x70/28a745/ffffff?text=Social+Impact+Hub",
      type: "Innovation Partner"
    },
    {
      id: 10,
      name: "Media Partners Network",
      logo: "https://via.placeholder.com/140x70/28a745/ffffff?text=Media+Partners+Network",
      type: "Media Partner"
    },
    {
      id: 11,
      name: "Startup Incubators",
      logo: "https://via.placeholder.com/140x70/28a745/ffffff?text=Startup+Incubators",
      type: "Business Partner"
    },
    {
      id: 12,
      name: "Cultural Exchange Foundation",
      logo: "https://via.placeholder.com/140x70/28a745/ffffff?text=Cultural+Exchange+Foundation",
      type: "Cultural Partner"
    }
  ];

  const partnershipTiers = [
    {
      tier: "Diamond Partner",
      amount: "$50,000+",
      color: "primary",
      benefits: [
        "Premier logo placement on all materials",
        "Speaking opportunities at main events",
        "Dedicated networking sessions",
        "Annual partnership report",
        "Direct access to program alumni network",
        "Custom partnership activities"
      ]
    },
    {
      tier: "Gold Partner",
      amount: "$25,000 - $49,999",
      color: "warning",
      benefits: [
        "Prominent logo placement",
        "Workshop sponsorship opportunities",
        "Alumni network access",
        "Quarterly impact reports",
        "Social media recognition"
      ]
    },
    {
      tier: "Silver Partner",
      amount: "$10,000 - $24,999", 
      color: "secondary",
      benefits: [
        "Logo placement on website",
        "Newsletter mentions",
        "Event participation opportunities",
        "Impact reports",
        "Certificate of partnership"
      ]
    },
    {
      tier: "Community Partner",
      amount: "In-kind/Services",
      color: "success",
      benefits: [
        "Website recognition",
        "Social media mentions",
        "Networking opportunities",
        "Partnership certificate",
        "Volunteer opportunities"
      ]
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <Section background="gradient" padding="lg" className="text-white text-center">
        <h1 className="display-5 fw-bold mb-3">Partners & Sponsors</h1>
        <p className="lead mb-0">
          Meet our valued partners and sponsors who make our programs possible and help us empower young leaders worldwide
        </p>
      </Section>

      {/* Partnership Value Proposition */}
      <Section padding="lg">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h2 className="mb-4">Why Partner With Us?</h2>
            <div className="row g-4">
              <div className="col-sm-6">
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-primary bg-opacity-10 rounded p-3">
                      <i className="ri-global-line text-primary fs-4"></i>
                    </div>
                  </div>
                  <div className="ms-3">
                    <h5>Global Reach</h5>
                    <p className="text-muted mb-0">Connect with 4,000+ young leaders from 120+ countries</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-success bg-opacity-10 rounded p-3">
                      <i className="ri-lightbulb-line text-success fs-4"></i>
                    </div>
                  </div>
                  <div className="ms-3">
                    <h5>Innovation Focus</h5>
                    <p className="text-muted mb-0">Support cutting-edge projects and social impact initiatives</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-warning bg-opacity-10 rounded p-3">
                      <i className="ri-trophy-line text-warning fs-4"></i>
                    </div>
                  </div>
                  <div className="ms-3">
                    <h5>Brand Visibility</h5>
                    <p className="text-muted mb-0">Enhance your brand presence among future leaders</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-info bg-opacity-10 rounded p-3">
                      <i className="ri-heart-line text-info fs-4"></i>
                    </div>
                  </div>
                  <div className="ms-3">
                    <h5>Social Impact</h5>
                    <p className="text-muted mb-0">Make a lasting difference in youth development worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 text-center">
            <div className="position-relative">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '300px', height: '300px' }}>
                <div className="text-center">
                  <i className="ri-team-line text-primary" style={{ fontSize: '5rem' }}></i>
                  <h4 className="text-primary mt-3">Join Our Network</h4>
                  <p className="text-muted">Become a partner today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Diamond Sponsors */}
      <Section background="light" padding="lg">
        <div className="text-center mb-5">
          <h2 className="mb-4">💎 Diamond Sponsors</h2>
          <p className="text-muted">
            Our premier partners providing transformational support for our programs
          </p>
        </div>

        <div className="row justify-content-center">
          {diamondSponsors.map((sponsor) => (
            <div key={sponsor.id} className="col-lg-8">
              <div className="card border-primary shadow-lg">
                <div className="card-body p-5">
                  <div className="row align-items-center">
                    <div className="col-md-4 text-center">
                      <img src={sponsor.logo} alt={sponsor.name} className="img-fluid mb-3" style={{ maxHeight: '100px' }} />
                      <h4>{sponsor.name}</h4>
                      <p className="text-primary fw-semibold">Partner since {sponsor.yearStarted}</p>
                    </div>
                    <div className="col-md-8">
                      <h5 className="text-primary">Contribution: {sponsor.contribution}</h5>
                      <p className="text-muted">{sponsor.description}</p>
                      <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        <i className="ri-external-link-line me-2"></i>Visit Website
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Gold Sponsors */}
      <Section padding="lg">
        <div className="text-center mb-5">
          <h2 className="mb-4">🥇 Gold Sponsors</h2>
          <p className="text-muted">
            Strategic partners supporting major program components
          </p>
        </div>

        <div className="row g-4">
          {goldSponsors.map((sponsor) => (
            <div key={sponsor.id} className="col-md-6">
              <div className="card border-warning shadow h-100">
                <div className="card-body text-center p-4">
                  <img src={sponsor.logo} alt={sponsor.name} className="img-fluid mb-3" style={{ maxHeight: '80px' }} />
                  <h5>{sponsor.name}</h5>
                  <p className="text-warning fw-semibold mb-2">Partner since {sponsor.yearStarted}</p>
                  <p className="text-muted small">{sponsor.contribution}</p>
                  <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="btn btn-outline-warning btn-sm">
                    <i className="ri-external-link-line me-1"></i>Learn More
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Silver Sponsors */}
      <Section background="light" padding="lg">
        <div className="text-center mb-5">
          <h2 className="mb-4">🥈 Silver Sponsors</h2>
          <p className="text-muted">
            Valued supporters contributing to program success
          </p>
        </div>

        <div className="row g-4">
          {silverSponsors.map((sponsor) => (
            <div key={sponsor.id} className="col-md-4">
              <div className="card shadow h-100">
                <div className="card-body text-center p-4">
                  <img src={sponsor.logo} alt={sponsor.name} className="img-fluid mb-3" style={{ maxHeight: '60px' }} />
                  <h6>{sponsor.name}</h6>
                  <p className="text-muted small mb-2">{sponsor.contribution}</p>
                  <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm">
                    <i className="ri-external-link-line me-1"></i>Visit
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Community Partners */}
      <Section padding="lg">
        <div className="text-center mb-5">
          <h2 className="mb-4">🤝 Community Partners</h2>
          <p className="text-muted">
            Organizations providing in-kind support and collaboration
          </p>
        </div>

        <div className="row g-3">
          {communityPartners.map((partner) => (
            <div key={partner.id} className="col-lg-2 col-md-3 col-sm-4 col-6">
              <div className="card shadow-sm h-100">
                <div className="card-body text-center p-3">
                  <img src={partner.logo} alt={partner.name} className="img-fluid mb-2" style={{ maxHeight: '40px' }} />
                  <h6 className="small mb-1">{partner.name}</h6>
                  <p className="text-success small mb-0">{partner.type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Partnership Opportunities */}
      <Section background="light" padding="xl">
        <div className="text-center mb-5">
          <h2 className="mb-4">Partnership Opportunities</h2>
          <p className="text-muted lead">
            Join us in creating lasting impact through strategic partnerships
          </p>
        </div>

        <div className="row g-4">
          {partnershipTiers.map((tier, index) => (
            <div key={index} className="col-lg-3 col-md-6">
              <div className={`card border-${tier.color} shadow h-100`}>
                <div className={`card-header bg-${tier.color} text-white text-center`}>
                  <h5 className="mb-0">{tier.tier}</h5>
                  <p className="mb-0 fw-bold">{tier.amount}</p>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="mb-2">
                        <i className={`ri-check-line text-${tier.color} me-2`}></i>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Partnership Impact Stats */}
      <Section padding="lg">
        <div className="text-center mb-5">
          <h2 className="mb-4">Partnership Impact</h2>
          <p className="text-muted">
            Together, we're making a difference worldwide
          </p>
        </div>

        <div className="row g-4 text-center">
          <div className="col-md-3">
            <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
              <i className="ri-building-line text-primary fs-3"></i>
            </div>
            <h3 className="text-primary">50+</h3>
            <p className="text-muted">Partner Organizations</p>
          </div>
          <div className="col-md-3">
            <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
              <i className="ri-funds-line text-success fs-3"></i>
            </div>
            <h3 className="text-success">$2.5M+</h3>
            <p className="text-muted">Total Partnership Value</p>
          </div>
          <div className="col-md-3">
            <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
              <i className="ri-user-star-line text-warning fs-3"></i>
            </div>
            <h3 className="text-warning">10,000+</h3>
            <p className="text-muted">Youth Impacted</p>
          </div>
          <div className="col-md-3">
            <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
              <i className="ri-global-line text-info fs-3"></i>
            </div>
            <h3 className="text-info">120+</h3>
            <p className="text-muted">Countries Reached</p>
          </div>
        </div>
      </Section>

      {/* Call to Action */}
      <Section background="gradient" padding="lg" className="text-white text-center">
        <h2 className="mb-4">Ready to Partner With Us?</h2>
        <p className="lead mb-4">
          Let's work together to create opportunities for young leaders worldwide
        </p>
        <div className="d-flex flex-wrap gap-3 justify-content-center">
          <a href="/contact" className="btn btn-light btn-lg">
            <i className="ri-message-2-line me-2"></i>
            Contact Us
          </a>
          <a href="/apply" className="btn btn-outline-light btn-lg">
            <i className="ri-download-line me-2"></i>
            Partnership Proposal
          </a>
        </div>

        <div className="mt-5">
          <h5 className="mb-3">Get In Touch</h5>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="row text-center">
                <div className="col-md-4">
                  <i className="ri-mail-line fs-4 mb-2"></i>
                  <p className="mb-0">partnerships@ybbprogram.com</p>
                </div>
                <div className="col-md-4">
                  <i className="ri-phone-line fs-4 mb-2"></i>
                  <p className="mb-0">+1 (555) 123-4567</p>
                </div>
                <div className="col-md-4">
                  <i className="ri-linkedin-line fs-4 mb-2"></i>
                  <p className="mb-0">@ybbprogram</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </PublicLayout>
  );
};

export default PartnersSponsorsPage;
          
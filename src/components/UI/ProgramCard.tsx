'use client';
import React from 'react';
import { Button } from 'reactstrap';

interface ProgramCardProps {
  title: string;
  description: string;
  image?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  price?: {
    selfFunded?: string | number;
    fullyFunded?: string | number;
  };
  registrationStatus?: 'open' | 'closed' | 'coming-soon';
  onRegister?: () => void;
  onLearnMore?: () => void;
  className?: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  title,
  description,
  image,
  duration,
  startDate,
  endDate,
  price,
  registrationStatus = 'open',
  onRegister,
  onLearnMore,
  className = ''
}) => {
  const getStatusBadge = () => {
    switch (registrationStatus) {
      case 'open':
        return <span className="badge bg-success">Registration Open</span>;
      case 'closed':
        return <span className="badge bg-danger">Registration Closed</span>;
      case 'coming-soon':
        return <span className="badge bg-warning">Coming Soon</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`program-card card h-100 ${className}`}>
      {image && (
        <div className="program-card-image">
          <img src={image} className="card-img-top" alt={title} />
          <div className="program-card-overlay">
            {getStatusBadge()}
          </div>
        </div>
      )}
      
      <div className="card-body d-flex flex-column">
        <h4 className="card-title">{title}</h4>
        <p className="card-text text-muted flex-grow-1">{description}</p>
        
        {/* Program Details */}
        <div className="program-details mb-3">
          {duration && (
            <div className="program-detail-item">
              <i className="ri-time-line text-primary me-2"></i>
              <span>{duration}</span>
            </div>
          )}
          {startDate && endDate && (
            <div className="program-detail-item">
              <i className="ri-calendar-line text-primary me-2"></i>
              <span>{startDate} - {endDate}</span>
            </div>
          )}
        </div>

        {/* Pricing */}
        {price && (
          <div className="program-pricing mb-3">
            <div className="row">
              {price.selfFunded && (
                <div className="col-6">
                  <div className="pricing-option">
                    <small className="text-muted">Self Funded</small>
                    <div className="price">${price.selfFunded}</div>
                  </div>
                </div>
              )}
              {price.fullyFunded && (
                <div className="col-6">
                  <div className="pricing-option">
                    <small className="text-muted">Fully Funded</small>
                    <div className="price">${price.fullyFunded}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="program-actions">
          <div className="d-flex gap-2">
            {onLearnMore && (
              <Button 
                color="outline-primary" 
                size="sm" 
                className="flex-grow-1"
                onClick={onLearnMore}
              >
                Learn More
              </Button>
            )}
            {onRegister && registrationStatus === 'open' && (
              <Button 
                color="primary" 
                size="sm" 
                className="flex-grow-1"
                onClick={onRegister}
              >
                Register Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
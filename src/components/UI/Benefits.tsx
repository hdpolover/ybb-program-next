'use client';
import React from 'react';
import { Row, Col } from 'reactstrap';

interface BenefitItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  color?: 'primary' | 'success' | 'info' | 'warning' | 'danger';
}

interface BenefitsProps {
  title?: string;
  subtitle?: string;
  benefits: BenefitItem[];
  layout?: 'grid' | 'alternating';
  columns?: 2 | 3 | 4;
  className?: string;
}

const Benefits: React.FC<BenefitsProps> = ({
  title = "Delegate Benefits",
  subtitle = "What you'll gain from this transformative experience", 
  benefits,
  layout = 'grid',
  columns = 3,
  className = ''
}) => {
  const getColClass = () => {
    switch (columns) {
      case 2:
        return 'col-lg-6 col-md-6';
      case 4:
        return 'col-lg-3 col-md-6';
      default:
        return 'col-lg-4 col-md-6';
    }
  };

  if (layout === 'alternating') {
    return (
      <div className={`benefits-section ${className}`}>
        {title && (
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold">{title}</h2>
            {subtitle && <p className="lead text-muted">{subtitle}</p>}
          </div>
        )}
        
        <div className="benefits-alternating">
          {benefits.map((benefit, index) => (
            <Row key={benefit.id} className={`align-items-center mb-5 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}>
              <Col lg={6}>
                <div className={`text-center ${index % 2 === 1 ? 'text-lg-start' : 'text-lg-end'}`}>
                  <div className={`bg-${benefit.color || 'primary'} bg-opacity-10 p-4 rounded-circle d-inline-flex mb-3`}>
                    <i className={`${benefit.icon} text-${benefit.color || 'primary'} fs-1`}></i>
                  </div>
                </div>
              </Col>
              <Col lg={6}>
                <div className={index % 2 === 1 ? 'text-lg-end' : 'text-lg-start'}>
                  <h3 className="h4 mb-3">{benefit.title}</h3>
                  <p className="text-muted lh-lg">{benefit.description}</p>
                </div>
              </Col>
            </Row>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`benefits-section ${className}`}>
      {title && (
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">{title}</h2>
          {subtitle && <p className="lead text-muted">{subtitle}</p>}
        </div>
      )}
      
      <Row className="g-4">
        {benefits.map((benefit, index) => (
          <div key={benefit.id} className={getColClass()}>
            <div className="benefit-card text-center h-100 p-4">
              <div className={`bg-${benefit.color || 'primary'} bg-opacity-10 p-4 rounded-circle d-inline-flex mb-3`}>
                <i className={`${benefit.icon} text-${benefit.color || 'primary'} fs-1`}></i>
              </div>
              <h4 className="h5 mb-3">{benefit.title}</h4>
              <p className="text-muted mb-0 lh-lg">{benefit.description}</p>
            </div>
          </div>
        ))}
      </Row>
    </div>
  );
};

export default Benefits;
'use client';
import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';

interface ObjectiveItem {
  id: number;
  title: string;
  description: string;
  icon?: string;
}

interface ObjectivesProps {
  title?: string;
  subtitle?: string;
  objectives: ObjectiveItem[];
  layout?: 'grid' | 'list';
  columns?: 2 | 3 | 4;
  className?: string;
}

const Objectives: React.FC<ObjectivesProps> = ({
  title = "Program Objectives",
  subtitle = "What we aim to achieve together",
  objectives,
  layout = 'grid',
  columns = 2,
  className = ''
}) => {
  const getColClass = () => {
    switch (columns) {
      case 3:
        return 'col-lg-4 col-md-6';
      case 4:
        return 'col-lg-3 col-md-6';
      default:
        return 'col-lg-6';
    }
  };

  if (layout === 'list') {
    return (
      <div className={`objectives-section ${className}`}>
        {title && (
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold">{title}</h2>
            {subtitle && <p className="lead text-muted">{subtitle}</p>}
          </div>
        )}
        
        <div className="objectives-list">
          {objectives.map((objective, index) => (
            <div key={objective.id} className="objective-item mb-4">
              <div className="d-flex">
                <div className="flex-shrink-0 me-4">
                  <div className="objective-number bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                    <span className="fw-bold">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <h4 className="h5 mb-2">{objective.title}</h4>
                  <p className="text-muted mb-0">{objective.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`objectives-section ${className}`}>
      {title && (
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">{title}</h2>
          {subtitle && <p className="lead text-muted">{subtitle}</p>}
        </div>
      )}
      
      <Row className="g-4">
        {objectives.map((objective, index) => (
          <div key={objective.id} className={getColClass()}>
            <Card className="h-100 border-0 shadow-sm objective-card">
              <CardBody className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="objective-number bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                    <span className="fw-bold small">{index + 1}</span>
                  </div>
                  {objective.icon && (
                    <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                      <i className={`${objective.icon} text-primary`}></i>
                    </div>
                  )}
                </div>
                <h4 className="h5 mb-3">{objective.title}</h4>
                <p className="text-muted mb-0 lh-lg">{objective.description}</p>
              </CardBody>
            </Card>
          </div>
        ))}
      </Row>
    </div>
  );
};

export default Objectives;
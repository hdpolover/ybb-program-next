'use client';
import React from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';

interface VisionMissionProps {
  vision?: {
    title: string;
    content: string;
    icon?: string;
  };
  mission?: {
    title: string;
    items: string[];
    icon?: string;
  };
  className?: string;
}

const VisionMission: React.FC<VisionMissionProps> = ({
  vision,
  mission,
  className = ''
}) => {
  return (
    <div className={`vision-mission-section ${className}`}>
      <Row className="g-4">
        {vision && (
          <Col lg={6}>
            <Card className="h-100 border-0 shadow-sm">
              <CardBody className="p-4">
                <div className="d-flex align-items-center mb-3">
                  {vision.icon && (
                    <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                      <i className={`${vision.icon} text-primary fs-4`}></i>
                    </div>
                  )}
                  <h3 className="h4 mb-0 text-primary">{vision.title}</h3>
                </div>
                <p className="text-muted mb-0 lh-lg">{vision.content}</p>
              </CardBody>
            </Card>
          </Col>
        )}
        
        {mission && (
          <Col lg={6}>
            <Card className="h-100 border-0 shadow-sm">
              <CardBody className="p-4">
                <div className="d-flex align-items-center mb-3">
                  {mission.icon && (
                    <div className="bg-success bg-opacity-10 p-3 rounded me-3">
                      <i className={`${mission.icon} text-success fs-4`}></i>
                    </div>
                  )}
                  <h3 className="h4 mb-0 text-success">{mission.title}</h3>
                </div>
                <ul className="list-unstyled mb-0">
                  {mission.items.map((item, index) => (
                    <li key={index} className="mb-3 d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
                          <i className="ri-check-line text-success small"></i>
                        </div>
                      </div>
                      <div className="text-muted lh-lg">{item}</div>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default VisionMission;
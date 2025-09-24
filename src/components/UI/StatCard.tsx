'use client';
import React from 'react';
import { Card, CardBody } from 'reactstrap';

interface StatCardProps {
  icon: string;
  number: string | number;
  label: string;
  suffix?: string;
  prefix?: string;
  color?: 'primary' | 'success' | 'warning' | 'info' | 'danger';
  animate?: boolean;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  number,
  label,
  suffix = '',
  prefix = '',
  color = 'primary',
  animate = true,
  className = ''
}) => {
  return (
    <Card className={`stat-card ${className}`}>
      <CardBody>
        <div className="d-flex align-items-center">
          <div className={`stat-icon bg-${color} bg-opacity-10 text-${color}`}>
            <i className={icon}></i>
          </div>
          <div className="stat-content ms-3 flex-grow-1">
            <h3 className={`stat-number mb-1 ${animate ? 'counter-up' : ''}`}>
              {prefix}{number}{suffix}
            </h3>
            <p className="stat-label text-muted mb-0">{label}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default StatCard;
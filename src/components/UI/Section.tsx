'use client';
import React, { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  className?: string;
  background?: 'white' | 'light' | 'dark' | 'primary' | 'gradient';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
}

const Section: React.FC<SectionProps> = ({
  id,
  className = '',
  background = 'white',
  padding = 'lg',
  children
}) => {
  const getBackgroundClass = () => {
    switch (background) {
      case 'light':
        return 'bg-light';
      case 'dark':
        return 'bg-dark text-white';
      case 'primary':
        return 'bg-primary text-white';
      case 'gradient':
        return 'bg-gradient-primary text-white';
      default:
        return '';
    }
  };

  const getPaddingClass = () => {
    switch (padding) {
      case 'sm':
        return 'py-3';
      case 'md':
        return 'py-4';
      case 'xl':
        return 'py-6';
      default:
        return 'py-5';
    }
  };

  return (
    <section 
      id={id}
      className={`section ${getBackgroundClass()} ${getPaddingClass()} ${className}`}
    >
      <div className="container">
        {children}
      </div>
    </section>
  );
};

export default Section;
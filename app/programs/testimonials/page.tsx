'use client';
import React from 'react';
import HeroSection from '@/components/ui/HeroSection';
import TestimonialsGrid from '@/components/programs/testimonials/TestimonialsGrid';
import TestimonialsImpact from '@/components/programs/testimonials/TestimonialsImpact';

export default function ProgramsTestimonialsPage() {
  return (
    <main className="relative">
      <HeroSection
        title="Testimonials"
        subtitle="Stories and feedback from participants across cohorts."
        bgImage="/img/bgprogramoverview.png"
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/programs', label: 'Programs' },
          { href: '/programs/testimonials', label: 'Testimonials' },
        ]}
      />

      <TestimonialsGrid />

      <TestimonialsImpact />
    </main>
  );
}

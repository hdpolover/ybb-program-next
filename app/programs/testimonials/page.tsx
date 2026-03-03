'use client';
import React from 'react';
import HeroSection from '@/components/ui/HeroSection';
import TestimonialsGrid from '@/components/programs/testimonials/TestimonialsGrid';
import TestimonialsImpact from '@/components/programs/testimonials/TestimonialsImpact';
import { PROGRAMS_HERO_TESTIMONIALS } from '@/data/programs/sections/subpages-hero/programsSubpagesHero';

export default function ProgramsTestimonialsPage() {
  return (
    <main className="relative">
      <HeroSection
        title={PROGRAMS_HERO_TESTIMONIALS.title}
        subtitle={PROGRAMS_HERO_TESTIMONIALS.subtitle}
        bgImage="/img/bgprogramoverview.png"
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/programs', label: 'Programs' },
          { href: '/programs/testimonials', label: 'Testimonials' },
        ]}
      />

      {/* grid testimoni utama */}
      <TestimonialsGrid />

      {/* section impact testimoni lanjutan */}
      <TestimonialsImpact />
    </main>
  );
}

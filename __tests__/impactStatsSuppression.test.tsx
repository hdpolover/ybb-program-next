// __tests__/impactStatsSuppression.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TestimonialsImpact from '@/components/programs/testimonials/TestimonialsImpact';
import ProvenResultsSection from '@/components/partners/ProvenResults';
import GlobalProgramImpact from '@/components/sections/GlobalProgramImpact';
import type { ImpactStat, ProgramImpactSection } from '@/types/home';

const stat = (id: ImpactStat['icon'], label: string, value: string): ImpactStat => ({
  id,
  label,
  value,
  icon: id,
});

// The four figures these surfaces used to hardcode. None of them can be derived
// from the schema, so none of them may reappear as a fallback.
const FABRICATED = ['4,000+', '120+', '95%', '500+', '630,000+', '$2.5M+', '10,000+'];

function expectNoInventedNumbers(html: string) {
  FABRICATED.forEach(literal => expect(html).not.toContain(literal));
}

describe('TestimonialsImpact', () => {
  it('renders every curated figure the impact_stats row supplies, editions included', () => {
    render(
      <TestimonialsImpact
        stats={[
          stat('participants', 'Total Participants', '1700+'),
          stat('countries', 'Total Countries', '50+'),
          stat('alumni', 'Total Alumni', '1700+'),
          stat('editions', 'Editions Held', '15+'),
        ]}
      />,
    );

    expect(screen.getByText('Editions Held')).toBeInTheDocument();
    expect(screen.getAllByText('1700+')).toHaveLength(2);
    expect(screen.getByText('50+')).toBeInTheDocument();
  });

  it('renders nothing at all when impact_stats is missing — no shell, no placeholders', () => {
    const { container } = render(<TestimonialsImpact />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when the section arrived with an empty stats array (stale snapshot)', () => {
    const { container } = render(<TestimonialsImpact stats={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('drops a single missing figure instead of substituting the old hardcoded one', () => {
    const { container } = render(
      <TestimonialsImpact stats={[stat('countries', 'Total Countries', '50+')]} />,
    );

    expect(screen.getByText('50+')).toBeInTheDocument();
    expect(screen.queryByText('Satisfaction Rate')).not.toBeInTheDocument();
    expect(screen.queryByText('Social Projects')).not.toBeInTheDocument();
    expectNoInventedNumbers(container.innerHTML);
  });
});

describe('ProvenResults', () => {
  it('shows the curated participants figure', () => {
    render(<ProvenResultsSection impactValue="1700+" />);
    expect(screen.getByText('1700+')).toBeInTheDocument();
    expect(screen.getByText('participants across our programs')).toBeInTheDocument();
  });

  it('renders nothing at all when no figure exists', () => {
    // The impact figure is now the only content in this section. It used to also
    // carry a card of ten sponsor logos, every one of them an invented
    // organisation linking to a /partners/<slug> page that returns 200, so
    // "keep the logos, drop the figure" is no longer a state worth having.
    expect(render(<ProvenResultsSection />).container).toBeEmptyDOMElement();
  });

  it('never renders a fabricated sponsor, and does not link to one', () => {
    const { container } = render(<ProvenResultsSection impactValue="1700+" />);

    expect(screen.queryByText(/and Our Other Sponsors/i)).not.toBeInTheDocument();
    for (const slug of [
      'iys-global',
      'kys-education',
      'meys-media-group',
      'wys-technology',
      'yaf-foundation',
      'kys-learning-hub',
      'meys-broadcasting',
      'wys-digital-studio',
    ]) {
      expect(container.innerHTML).not.toContain(slug);
    }
    expectNoInventedNumbers(container.innerHTML);
  });
});

describe('GlobalProgramImpact', () => {
  it('renders nothing when the section is absent or carries no surviving stat', () => {
    expect(render(<GlobalProgramImpact />).container).toBeEmptyDOMElement();

    const emptySection = {
      type: 'program_impact',
      content: { eyebrow: 'Global Reach', title: 'Global Program Impact', stats: [] },
    } satisfies ProgramImpactSection;
    expect(render(<GlobalProgramImpact section={emptySection} />).container).toBeEmptyDOMElement();
  });
});

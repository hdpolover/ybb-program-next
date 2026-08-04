// __tests__/ProgramSchedules.test.tsx

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProgramSchedules from '@/components/programs/ProgramSchedules';
import type { ProgramImportantDatesItem } from '@/types/programs';

function makeItem(overrides: Partial<ProgramImportantDatesItem>): ProgramImportantDatesItem {
  return {
    date_display: 'Jan 01, 2026',
    status: 'Upcoming',
    name: 'Milestone',
    description: '',
    is_active: false,
    ...overrides,
  };
}

describe('ProgramSchedules', () => {
  it('renders nothing when the section itself is absent', () => {
    const { container } = render(<ProgramSchedules dates={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders an empty state instead of a blank region when items is empty', () => {
    render(<ProgramSchedules dates={{ title: 'Schedules', subtitle: '', items: [] }} />);
    expect(screen.getByText(/no schedule published yet/i)).toBeInTheDocument();
  });

  it('groups items into Active now / Upcoming / Completed sections', () => {
    render(
      <ProgramSchedules
        dates={{
          title: 'Schedules',
          subtitle: '',
          items: [
            makeItem({ name: 'Kickoff', status: 'Active', is_active: true, start_date: '2026-01-01T00:00:00.000Z' }),
            makeItem({ name: 'Announcement', status: 'Upcoming', is_active: false, start_date: '2026-03-01T00:00:00.000Z' }),
            makeItem({ name: 'Registration', status: 'Passed', is_active: false, start_date: '2025-01-01T00:00:00.000Z' }),
          ],
        }}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Active now' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Upcoming' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Completed' })).toBeInTheDocument();
    expect(screen.getByText('Kickoff')).toBeInTheDocument();
    expect(screen.getByText('Announcement')).toBeInTheDocument();
    expect(screen.getByText('Registration')).toBeInTheDocument();
  });

  it('renders structured dates in WIB instead of the raw legacy display text', () => {
    render(
      <ProgramSchedules
        dates={{
          title: 'Schedules',
          subtitle: '',
          items: [
            makeItem({
              name: 'Kickoff',
              status: 'Upcoming',
              date_display: 'this text should not be shown verbatim',
              start_date: '2026-08-01T00:00:00.000Z',
            }),
          ],
        }}
      />,
    );

    expect(screen.getByText(/WIB/)).toBeInTheDocument();
    expect(screen.queryByText('this text should not be shown verbatim')).not.toBeInTheDocument();
  });

  it('falls back to the legacy free-text date_display when structured dates are missing', () => {
    render(
      <ProgramSchedules
        dates={{
          title: 'Schedules',
          subtitle: '',
          items: [makeItem({ name: 'Legacy row', date_display: 'Coming Soon', start_date: undefined })],
        }}
      />,
    );

    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
  });
});

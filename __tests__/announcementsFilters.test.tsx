// __tests__/announcementsFilters.test.tsx
//
// AnnouncementsFilters must submit by navigating to a new URL (GET form /
// real links), never by mutating local state only.
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnnouncementsFilters from '@/components/announcements/AnnouncementsFilters';
import type { AnnouncementsSearchParams } from '@/lib/announcements';
import type { AnnouncementsFilterValues } from '@/types/announcements';

const FILTERS: AnnouncementsFilterValues = {
  categories: ['News', 'General'],
  tags: ['visa', 'scholarship'],
  programs: [{ id: 'prog-1', title: 'MEYS 6th' }],
};

const EMPTY: AnnouncementsSearchParams = { page: 1 };

describe('AnnouncementsFilters', () => {
  it('renders a real GET form targeting the base path, not a client-only onSubmit', () => {
    render(<AnnouncementsFilters current={EMPTY} filters={FILTERS} basePath="/announcements" />);

    const form = document.querySelector('form');
    expect(form).not.toBeNull();
    expect(form).toHaveAttribute('method', 'get');
    expect(form).toHaveAttribute('action', '/announcements');
  });

  it('search input carries the "q" name so a GET submit lands on ?q=...', () => {
    render(<AnnouncementsFilters current={EMPTY} filters={FILTERS} basePath="/announcements" />);
    const input = screen.getByRole('textbox', { name: 'Search announcements' }) as HTMLInputElement;
    expect(input).toHaveAttribute('name', 'q');
  });

  it('pre-fills the search box, tag select, edition select and year input from current params', () => {
    const current: AnnouncementsSearchParams = {
      page: 1,
      search: 'scholarship',
      tag: 'visa',
      programId: 'prog-1',
      year: 2026,
    };
    render(<AnnouncementsFilters current={current} filters={FILTERS} basePath="/announcements" />);

    expect(screen.getByRole('textbox', { name: 'Search announcements' })).toHaveValue('scholarship');
    expect(screen.getByLabelText('Tag')).toHaveValue('visa');
    expect(screen.getByLabelText('Edition')).toHaveValue('prog-1');
    expect(screen.getByLabelText('Year')).toHaveValue(2026);
  });

  it('carries the active category through as a hidden field so search/tag submits don’t clear it', () => {
    const current: AnnouncementsSearchParams = { page: 1, category: 'News' };
    render(<AnnouncementsFilters current={current} filters={FILTERS} basePath="/announcements" />);

    const hidden = document.querySelector('input[type="hidden"][name="category"]') as HTMLInputElement;
    expect(hidden).not.toBeNull();
    expect(hidden.value).toBe('News');
  });

  it('renders category pills as real links (not buttons), preserving other active params', () => {
    const current: AnnouncementsSearchParams = { page: 1, search: 'visa', tag: 'scholarship' };
    render(<AnnouncementsFilters current={current} filters={FILTERS} basePath="/announcements" />);

    const newsLink = screen.getByRole('link', { name: 'News' });
    expect(newsLink.tagName).toBe('A');
    expect(newsLink).toHaveAttribute('href', '/announcements?q=visa&category=News&tag=scholarship');

    const allLink = screen.getByRole('link', { name: 'All' });
    expect(allLink).toHaveAttribute('href', '/announcements?q=visa&tag=scholarship');
  });

  it('marks the active category pill with aria-current', () => {
    render(
      <AnnouncementsFilters current={{ page: 1, category: 'News' }} filters={FILTERS} basePath="/announcements" />,
    );
    expect(screen.getByRole('link', { name: 'News' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'All' })).not.toHaveAttribute('aria-current');
  });

  it('omits the tag/edition/year row entirely when there is nothing to filter by', () => {
    const noFacets: AnnouncementsFilterValues = { categories: ['News'], tags: [], programs: [] };
    render(<AnnouncementsFilters current={EMPTY} filters={noFacets} basePath="/announcements" />);
    expect(screen.queryByLabelText('Tag')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Edition')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Year')).not.toBeInTheDocument();
  });
});

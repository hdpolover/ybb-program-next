// __tests__/announcementsFilters.test.tsx
//
// AnnouncementsFilters must submit by navigating to a new URL (GET form /
// real links), never by mutating local state only.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('renders an always-visible Apply filters submit button (not gated behind noscript/JS)', () => {
    render(<AnnouncementsFilters current={EMPTY} filters={FILTERS} basePath="/announcements" />);
    const applyButton = screen.getByRole('button', { name: 'Apply filters' });
    expect(applyButton).toHaveAttribute('type', 'submit');
    expect(applyButton.closest('noscript')).toBeNull();
  });

  it('has no hidden "page" field, so a GET submit (JS-triggered or native) always drops any stale page number', () => {
    render(<AnnouncementsFilters current={{ page: 3, category: 'News' }} filters={FILTERS} basePath="/announcements" />);
    expect(document.querySelector('input[name="page"]')).toBeNull();
  });

  describe('year control', () => {
    let requestSubmit: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      requestSubmit = vi.fn();
      HTMLFormElement.prototype.requestSubmit = requestSubmit;
    });

    it('falls back to a number input when filters.years is absent (older API responses mid-rollout)', () => {
      render(<AnnouncementsFilters current={EMPTY} filters={FILTERS} basePath="/announcements" />);
      const yearField = screen.getByLabelText('Year');
      expect(yearField.tagName).toBe('INPUT');
      expect(yearField).toHaveAttribute('type', 'number');
    });

    it('submits on blur (not on every keystroke) for the number-input fallback', () => {
      render(<AnnouncementsFilters current={EMPTY} filters={FILTERS} basePath="/announcements" />);
      const yearField = screen.getByLabelText('Year');
      fireEvent.change(yearField, { target: { value: '2025' } });
      expect(requestSubmit).not.toHaveBeenCalled();
      fireEvent.blur(yearField);
      expect(requestSubmit).toHaveBeenCalledTimes(1);
    });

    it('renders a <select> with "All years" plus one option per year when filters.years is present', () => {
      const withYears: AnnouncementsFilterValues = { ...FILTERS, years: [2026, 2024, 2025] };
      render(<AnnouncementsFilters current={EMPTY} filters={withYears} basePath="/announcements" />);
      const yearField = screen.getByLabelText('Year');
      expect(yearField.tagName).toBe('SELECT');
      expect(screen.getAllByRole('option', { name: /^(All years|20\d{2})$/ }).map((o) => o.textContent)).toEqual([
        'All years',
        '2026',
        '2025',
        '2024',
      ]);
    });

    it('submits on change for the year <select>', () => {
      const withYears: AnnouncementsFilterValues = { ...FILTERS, years: [2026, 2025] };
      render(<AnnouncementsFilters current={EMPTY} filters={withYears} basePath="/announcements" />);
      fireEvent.change(screen.getByLabelText('Year'), { target: { value: '2025' } });
      expect(requestSubmit).toHaveBeenCalledTimes(1);
    });

    it('keeps a ?year=XXXX not in filters.years visibly selected instead of discarding it', () => {
      const withYears: AnnouncementsFilterValues = { ...FILTERS, years: [2026, 2025] };
      render(
        <AnnouncementsFilters current={{ page: 1, year: 2019 }} filters={withYears} basePath="/announcements" />,
      );
      const yearField = screen.getByLabelText('Year') as HTMLSelectElement;
      expect(yearField).toHaveValue('2019');
      expect(screen.getByRole('option', { name: '2019' })).toBeInTheDocument();
    });

    it('submits on change for the tag/edition selects too', () => {
      render(<AnnouncementsFilters current={EMPTY} filters={FILTERS} basePath="/announcements" />);
      fireEvent.change(screen.getByLabelText('Tag'), { target: { value: 'visa' } });
      fireEvent.change(screen.getByLabelText('Edition'), { target: { value: 'prog-1' } });
      expect(requestSubmit).toHaveBeenCalledTimes(2);
    });
  });
});

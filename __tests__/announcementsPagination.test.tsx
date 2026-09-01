// __tests__/announcementsPagination.test.tsx
//
// AnnouncementsPagination must render a real <nav> of real <a>/<Link>
// elements pointing at ?page=N (crawlable, shareable) — never buttons that
// only mutate client state.
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnnouncementsPagination from '@/components/announcements/AnnouncementsPagination';

function hrefFor(page: number) {
  return `/announcements?page=${page}`;
}

describe('AnnouncementsPagination', () => {
  it('renders nothing when there is only one page', () => {
    const { container } = render(
      <AnnouncementsPagination currentPage={1} totalPages={1} buildHref={hrefFor} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a real nav landmark with real anchor elements for each page', () => {
    render(<AnnouncementsPagination currentPage={1} totalPages={3} buildHref={hrefFor} />);

    const nav = screen.getByRole('navigation', { name: 'Announcements pagination' });
    expect(nav.tagName).toBe('NAV');

    const page2 = screen.getByRole('link', { name: 'Page 2' });
    expect(page2.tagName).toBe('A');
    expect(page2).toHaveAttribute('href', '/announcements?page=2');

    const page3 = screen.getByRole('link', { name: 'Page 3' });
    expect(page3).toHaveAttribute('href', '/announcements?page=3');
  });

  it('marks the current page with aria-current="page"', () => {
    render(<AnnouncementsPagination currentPage={2} totalPages={3} buildHref={hrefFor} />);
    expect(screen.getByRole('link', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Page 1' })).not.toHaveAttribute('aria-current');
  });

  it('renders Prev/Next as real links pointing at the adjacent page', () => {
    render(<AnnouncementsPagination currentPage={2} totalPages={5} buildHref={hrefFor} />);
    expect(screen.getByRole('link', { name: 'Previous page' })).toHaveAttribute(
      'href',
      '/announcements?page=1',
    );
    expect(screen.getByRole('link', { name: 'Next page' })).toHaveAttribute(
      'href',
      '/announcements?page=3',
    );
  });

  it('disables Prev on page 1 and Next on the last page (no dead links)', () => {
    render(<AnnouncementsPagination currentPage={1} totalPages={5} buildHref={hrefFor} />);
    const prev = screen.getByLabelText('Previous page');
    expect(prev.tagName).toBe('SPAN');
    expect(prev).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('link', { name: 'Next page' })).toBeInTheDocument();
  });

  it('renders an ellipsis for truncated ranges with numbered links either side', () => {
    render(<AnnouncementsPagination currentPage={10} totalPages={20} buildHref={hrefFor} />);
    expect(screen.getAllByText('…').length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'Page 1' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Page 20' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Page 9' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Page 11' })).toBeInTheDocument();
  });

  it('preserves active filters in generated page links via buildHref', () => {
    const build = (page: number) => `/announcements?category=News&q=visa&page=${page}`;
    render(<AnnouncementsPagination currentPage={1} totalPages={3} buildHref={build} />);
    expect(screen.getByRole('link', { name: 'Page 2' })).toHaveAttribute(
      'href',
      '/announcements?category=News&q=visa&page=2',
    );
  });
});

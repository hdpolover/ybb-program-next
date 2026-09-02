// __tests__/photoGalleryEditions.test.tsx
//
// Homepage gallery edition switcher (components/sections/PhotoGallery.tsx).
// The homepage teaser used to show a single flat grid of the active program's
// photos; visitors can now switch between the brand's editions (KYS 2025,
// KYS 2026, ...) the way the old site allowed. These tests cover: the default
// tab is the active edition, switching swaps the grid, keyboard arrows move
// between tabs, a single edition renders no tab bar at all, and a payload
// cached before `tabs` existed still renders from the flat list.

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PhotoGallery, { type GalleryEdition } from '@/components/sections/PhotoGallery';

function edition(overrides: Partial<GalleryEdition> = {}): GalleryEdition {
  return {
    id: 'p-2026',
    label: 'Korea Youth Summit 2026',
    isActive: true,
    images: [{ id: 'img-2026', src: '/2026.jpg', caption: 'Photo 2026' }],
    ...overrides,
  };
}

const olderEdition = edition({
  id: 'p-2025',
  label: 'Korea Youth Summit 2025',
  isActive: false,
  images: [{ id: 'img-2025', src: '/2025.jpg', caption: 'Photo 2025' }],
});

const flatImages = [{ id: 'flat-1', src: '/flat.jpg', caption: 'Flat photo' }];

describe('PhotoGallery edition tabs', () => {
  it('defaults to the active edition and swaps the grid on selection', () => {
    render(<PhotoGallery mode="home" images={flatImages} editions={[edition(), olderEdition]} />);

    const activeTab = screen.getByRole('tab', { name: 'Korea Youth Summit 2026' });
    expect(activeTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByAltText('Photo 2026')).toBeInTheDocument();
    expect(screen.queryByAltText('Photo 2025')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Korea Youth Summit 2025' }));

    expect(screen.getByAltText('Photo 2025')).toBeInTheDocument();
    expect(screen.queryByAltText('Photo 2026')).not.toBeInTheDocument();
  });

  it('defaults to the newest tab when no edition is flagged active', () => {
    render(
      <PhotoGallery
        mode="home"
        images={flatImages}
        editions={[edition({ isActive: false }), olderEdition]}
      />,
    );

    expect(screen.getByRole('tab', { name: 'Korea Youth Summit 2026' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('moves between tabs with the arrow keys', () => {
    render(<PhotoGallery mode="home" images={flatImages} editions={[edition(), olderEdition]} />);

    fireEvent.keyDown(screen.getByRole('tab', { name: 'Korea Youth Summit 2026' }), {
      key: 'ArrowRight',
    });

    expect(screen.getByRole('tab', { name: 'Korea Youth Summit 2025' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByAltText('Photo 2025')).toBeInTheDocument();
  });

  it('renders no tab bar when only one edition has images', () => {
    render(<PhotoGallery mode="home" images={flatImages} editions={[edition()]} />);

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    // The single edition still drives the grid, not the flat fallback.
    expect(screen.getByAltText('Photo 2026')).toBeInTheDocument();
  });

  it('drops an edition with zero images instead of offering an empty tab', () => {
    render(
      <PhotoGallery
        mode="home"
        images={flatImages}
        editions={[edition({ images: [] }), olderEdition]}
      />,
    );

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.getByAltText('Photo 2025')).toBeInTheDocument();
  });

  it('falls back to the flat image list when the payload carries no tabs', () => {
    render(<PhotoGallery mode="home" images={flatImages} />);

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.getByAltText('Flat photo')).toBeInTheDocument();
  });
});

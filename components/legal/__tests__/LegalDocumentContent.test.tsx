// components/legal/__tests__/LegalDocumentContent.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LegalDocumentContent from '../LegalDocumentContent';

describe('LegalDocumentContent', () => {
  it('renders plain text preserving line breaks', () => {
    const { container } = render(<LegalDocumentContent content={'Line one\nLine two'} />);
    expect(container.firstElementChild).toHaveClass('whitespace-pre-wrap');
    expect(screen.getByText(/Line one/)).toBeInTheDocument();
  });

  it('renders HTML as prose and strips scripts', () => {
    const { container } = render(
      <LegalDocumentContent content={'<h2>Section</h2><script>alert(1)</script><p>Body</p>'} />,
    );
    expect(container.firstElementChild).toHaveClass('prose');
    expect(screen.getByRole('heading', { name: 'Section' })).toBeInTheDocument();
    expect(container.querySelector('script')).toBeNull();
  });
});

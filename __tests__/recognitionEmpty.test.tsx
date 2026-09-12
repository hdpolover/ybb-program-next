// __tests__/recognitionEmpty.test.tsx
//
// The KYS home page (2026-09-12) rendered "Recognition & Credibility" with the
// strapline "Proof that our program and organization are legitimate and
// credible" above a completely empty band: the brand had no proofs and no
// trademark, and the only guard was `if (!section)`. A section that promises
// proof and then shows none is worse than no section, so absence of content
// now hides the whole thing.

import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { OrganizationCredentialsSection } from '@/types/home';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) =>
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />,
}));

import Recognition from '@/components/sections/Recognition';

const TRADEMARK = {
  href: 'https://pdki-indonesia.dgip.go.id/',
  brand: 'Youth Break the Boundaries',
  regNo: 'IDM000123456',
  status: 'Registered',
  classText: 'Class 41',
  owner: 'PT YBB',
  logoUrl: '',
};

function section(
  content: Partial<OrganizationCredentialsSection['content']> = {},
): OrganizationCredentialsSection {
  return {
    type: 'organization_credentials',
    content: {
      title: 'Recognition & Credibility',
      subtitle: 'Proof that our program and organization are legitimate and credible.',
      proofs: [],
      trademark: null,
      ...content,
    },
  };
}

describe('Recognition', () => {
  it('renders nothing when the section is absent', () => {
    expect(render(<Recognition />).container).toBeEmptyDOMElement();
  });

  it('renders nothing when there are no proofs and no trademark, instead of a bare titled band', () => {
    expect(render(<Recognition section={section()} />).container).toBeEmptyDOMElement();
  });

  it('still renders when the only content is a trademark', () => {
    const { container } = render(<Recognition section={section({ trademark: TRADEMARK })} />);
    expect(container).not.toBeEmptyDOMElement();
    expect(container.textContent).toContain('Trademark Registered');
  });

  it('still renders when the only content is a proof', () => {
    const { container } = render(
      <Recognition
        section={section({
          proofs: [{ iconKey: 'ministry', title: 'Ministry Endorsed', subtitle: 'Kemenpora' }],
        })}
      />,
    );
    expect(container).not.toBeEmptyDOMElement();
    expect(container.textContent).toContain('Ministry Endorsed');
  });
});

// components/consent/__tests__/ConsentBanner.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const prompt = vi.hoisted(() => ({ value: 'banner' as 'banner' | 'notice' | null }));
vi.mock('@/lib/consent/useConsent', () => ({ useConsentPrompt: () => prompt.value }));

import ConsentBanner from '../ConsentBanner';

describe('ConsentBanner copy', () => {
  beforeEach(() => {
    prompt.value = 'banner';
  });

  it.each(['banner', 'notice'] as const)('%s offers equal Sounds good / No thanks buttons', (variant) => {
    prompt.value = variant;
    render(<ConsentBanner />);
    const yes = screen.getByRole('button', { name: 'Sounds good' });
    const no = screen.getByRole('button', { name: 'No thanks' });
    expect(yes.className).toBe(no.className);
  });

  it('opt-in region says nothing is tracked before consent', () => {
    render(<ConsentBanner />);
    expect(screen.getByRole('dialog').textContent).toContain('Nothing is tracked unless you say yes.');
  });

  it('elsewhere says you can say no anytime', () => {
    prompt.value = 'notice';
    render(<ConsentBanner />);
    expect(screen.getByRole('dialog').textContent).toContain('You can say no anytime.');
  });
});

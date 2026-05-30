import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import EnglishTextArea from '@/components/ui/EnglishTextArea';

function Harness() {
  const [v, setV] = useState('');
  return (
    <EnglishTextArea value={v} onChange={(e) => setV(e.target.value)} aria-label="ta" />
  );
}

describe('EnglishTextArea', () => {
  it('keeps newlines and ASCII punctuation, strips diacritics', async () => {
    render(<Harness />);
    const ta = screen.getByLabelText('ta') as HTMLTextAreaElement;
    await userEvent.type(ta, 'Hello, café!');
    expect(ta.value).toBe('Hello, caf!');
  });
});

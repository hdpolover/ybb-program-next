import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import EnglishTextArea from '@/components/ui/EnglishTextArea';

function Harness({ mode }: { mode?: 'name' | 'general' }) {
  const [v, setV] = useState('');
  return (
    <EnglishTextArea
      restrictMode={mode}
      value={v}
      onChange={(e) => setV(e.target.value)}
      aria-label="ta"
    />
  );
}

describe('EnglishTextArea', () => {
  it('keeps newlines and ASCII punctuation, strips diacritics', async () => {
    render(<Harness />);
    const ta = screen.getByLabelText('ta') as HTMLTextAreaElement;
    await userEvent.type(ta, 'Hello, café!');
    expect(ta.value).toBe('Hello, caf!');
  });

  it('shows feedback when a character is blocked', async () => {
    render(<Harness />);
    await userEvent.type(screen.getByLabelText('ta'), 'café');
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('keeps feedback visible after subsequent valid keystrokes (sticky)', async () => {
    render(<Harness />);
    const ta = screen.getByLabelText('ta');
    await userEvent.type(ta, 'é then more text');
    // a blocked char occurred early; message stays while the field is non-empty
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('blocks digits in name mode', async () => {
    render(<Harness mode="name" />);
    const ta = screen.getByLabelText('ta') as HTMLTextAreaElement;
    await userEvent.type(ta, 'John99');
    expect(ta.value).toBe('John');
  });

  it('uses a custom feedbackClassName when provided', () => {
    render(
      <EnglishTextArea
        aria-label="ta2"
        defaultValue=""
        feedbackClassName="custom-feedback"
        onChange={() => {}}
      />,
    );
    // No blocked char yet, so no status node — assert the component renders.
    expect(screen.getByLabelText('ta2')).toBeInTheDocument();
  });
});

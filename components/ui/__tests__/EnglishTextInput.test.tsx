import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import EnglishTextInput from '@/components/ui/EnglishTextInput';

function Harness({ mode }: { mode?: 'name' | 'general' }) {
  const [v, setV] = useState('');
  return (
    <EnglishTextInput
      restrictMode={mode}
      value={v}
      onChange={(e) => setV(e.target.value)}
      aria-label="field"
    />
  );
}

describe('EnglishTextInput', () => {
  it('blocks disallowed characters from appearing (name mode)', async () => {
    render(<Harness mode="name" />);
    const input = screen.getByLabelText('field') as HTMLInputElement;
    await userEvent.type(input, 'Nguyễn');
    expect(input.value).toBe('Nguyn');
  });

  it('shows feedback when a character is blocked', async () => {
    render(<Harness mode="name" />);
    await userEvent.type(screen.getByLabelText('field'), 'Ça');
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('keeps digits in general mode', async () => {
    render(<Harness mode="general" />);
    const input = screen.getByLabelText('field') as HTMLInputElement;
    await userEvent.type(input, 'Apt 3');
    expect(input.value).toBe('Apt 3');
  });
});

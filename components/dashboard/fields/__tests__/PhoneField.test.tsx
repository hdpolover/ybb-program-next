import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PhoneField } from '@/components/dashboard/fields/PhoneField';

describe('PhoneField defaultCountry', () => {
  it('defaults to Indonesia (+62) when empty and no defaultCountry given', () => {
    render(<PhoneField value="" onChange={() => {}} />);
    expect(screen.getByText('+62')).toBeInTheDocument();
  });

  it('follows defaultCountry (nationality) when empty', () => {
    render(<PhoneField value="" onChange={() => {}} defaultCountry="AE" />);
    expect(screen.getByText('+971')).toBeInTheDocument();
  });

  it('falls back to Indonesia when defaultCountry is unsupported', () => {
    // @ts-expect-error intentionally invalid code to exercise the fallback
    render(<PhoneField value="" onChange={() => {}} defaultCountry="ZZ" />);
    expect(screen.getByText('+62')).toBeInTheDocument();
  });

  it('uses the parsed country from an existing value over defaultCountry', () => {
    render(<PhoneField value="+14155552671" onChange={() => {}} defaultCountry="AE" />);
    expect(screen.getByText('+1')).toBeInTheDocument();
  });
});

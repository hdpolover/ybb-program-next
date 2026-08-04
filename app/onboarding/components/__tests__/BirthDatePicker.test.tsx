// app/onboarding/components/__tests__/BirthDatePicker.test.tsx

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BirthDatePicker, isValidBirthDate } from '@/app/onboarding/components/BirthDatePicker';

const MIN_DATE = '1950-01-01';
const MAX_DATE = '2020-12-31';

describe('isValidBirthDate', () => {
  it('accepts a well-formed date within bounds', () => {
    expect(isValidBirthDate('2000-06-15', MIN_DATE, MAX_DATE)).toBe(true);
  });

  it('rejects a date before the minimum', () => {
    expect(isValidBirthDate('1949-12-31', MIN_DATE, MAX_DATE)).toBe(false);
  });

  it('rejects a date after the maximum (future/out-of-range)', () => {
    expect(isValidBirthDate('2021-01-01', MIN_DATE, MAX_DATE)).toBe(false);
  });

  it('rejects an impossible calendar date', () => {
    expect(isValidBirthDate('2001-02-30', MIN_DATE, MAX_DATE)).toBe(false);
  });

  it('rejects a bare year', () => {
    expect(isValidBirthDate('2000', MIN_DATE, MAX_DATE)).toBe(false);
  });

  it('rejects an empty string', () => {
    expect(isValidBirthDate('', MIN_DATE, MAX_DATE)).toBe(false);
  });

  it('accepts the boundary dates themselves', () => {
    expect(isValidBirthDate(MIN_DATE, MIN_DATE, MAX_DATE)).toBe(true);
    expect(isValidBirthDate(MAX_DATE, MIN_DATE, MAX_DATE)).toBe(true);
  });
});

describe('BirthDatePicker', () => {
  it('renders the trigger with an accessible label', () => {
    render(
      <BirthDatePicker value="" onChange={vi.fn()} minDate={MIN_DATE} maxDate={MAX_DATE} />,
    );
    expect(screen.getByRole('button', { name: /date of birth/i })).toBeInTheDocument();
  });

  it('displays the selected date as DD/MM/YYYY', () => {
    render(
      <BirthDatePicker value="2000-06-15" onChange={vi.fn()} minDate={MIN_DATE} maxDate={MAX_DATE} />,
    );
    expect(screen.getByText('15/06/2000')).toBeInTheDocument();
  });

  it('opens the calendar on click and jumps to the selected date', () => {
    render(
      <BirthDatePicker value="1990-03-10" onChange={vi.fn()} minDate={MIN_DATE} maxDate={MAX_DATE} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /date of birth/i }));
    expect(screen.getByRole('button', { name: 'March' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1990' })).toBeInTheDocument();
  });

  it('calls onChange with an ISO date and closes when a day is picked', () => {
    const onChange = vi.fn();
    render(
      <BirthDatePicker value="1990-03-10" onChange={onChange} minDate={MIN_DATE} maxDate={MAX_DATE} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /date of birth/i }));
    fireEvent.click(screen.getByRole('button', { name: '15 March 1990' }));
    expect(onChange).toHaveBeenCalledWith('1990-03-15');
  });

  it('disables days outside the min/max bounds', () => {
    render(
      <BirthDatePicker value="2020-12-01" onChange={vi.fn()} minDate={MIN_DATE} maxDate={MAX_DATE} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /date of birth/i }));
    // December 2020 is the max-bound month (max = 2020-12-31), so every day is
    // selectable, but the "Next" month button must be disabled at this edge.
    expect(screen.getByRole('button', { name: /next month/i })).toBeDisabled();
  });

  it('disables the previous-month button at the minimum bound', () => {
    render(
      <BirthDatePicker value="1950-01-15" onChange={vi.fn()} minDate={MIN_DATE} maxDate={MAX_DATE} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /date of birth/i }));
    expect(screen.getByRole('button', { name: /previous month/i })).toBeDisabled();
  });

  it('closes the calendar on Escape', () => {
    render(
      <BirthDatePicker value="1990-03-10" onChange={vi.fn()} minDate={MIN_DATE} maxDate={MAX_DATE} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /date of birth/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('marks the dialog as a modal', () => {
    render(
      <BirthDatePicker value="1990-03-10" onChange={vi.fn()} minDate={MIN_DATE} maxDate={MAX_DATE} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /date of birth/i }));
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  describe('focus management', () => {
    it('returns focus to the trigger when Escape closes the calendar', () => {
      render(
        <BirthDatePicker value="1990-03-10" onChange={vi.fn()} minDate={MIN_DATE} maxDate={MAX_DATE} />,
      );
      const trigger = screen.getByRole('button', { name: /date of birth/i });
      fireEvent.click(trigger);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(trigger).toHaveFocus();
    });

    it('returns focus to the trigger after picking a day', () => {
      const onChange = vi.fn();
      render(
        <BirthDatePicker value="1990-03-10" onChange={onChange} minDate={MIN_DATE} maxDate={MAX_DATE} />,
      );
      const trigger = screen.getByRole('button', { name: /date of birth/i });
      fireEvent.click(trigger);
      fireEvent.click(screen.getByRole('button', { name: '15 March 1990' }));
      expect(trigger).toHaveFocus();
    });

    it('returns focus to the trigger when the Close button is clicked', () => {
      render(
        <BirthDatePicker value="1990-03-10" onChange={vi.fn()} minDate={MIN_DATE} maxDate={MAX_DATE} />,
      );
      const trigger = screen.getByRole('button', { name: /date of birth/i });
      fireEvent.click(trigger);
      fireEvent.click(screen.getByRole('button', { name: 'Close' }));
      expect(trigger).toHaveFocus();
    });

    it('returns focus to the trigger on an outside click that does not land on another focusable element', () => {
      render(
        <div>
          <BirthDatePicker value="1990-03-10" onChange={vi.fn()} minDate={MIN_DATE} maxDate={MAX_DATE} />
          <div data-testid="backdrop">outside</div>
        </div>,
      );
      const trigger = screen.getByRole('button', { name: /date of birth/i });
      fireEvent.click(trigger);
      fireEvent.mouseDown(screen.getByTestId('backdrop'));
      expect(trigger).toHaveFocus();
    });

    it('does not steal focus on an outside click that lands on another focusable control', () => {
      render(
        <div>
          <BirthDatePicker value="1990-03-10" onChange={vi.fn()} minDate={MIN_DATE} maxDate={MAX_DATE} />
          <input aria-label="Next field" />
        </div>,
      );
      const trigger = screen.getByRole('button', { name: /date of birth/i });
      fireEvent.click(trigger);
      const nextField = screen.getByRole('textbox', { name: 'Next field' });
      nextField.focus();
      fireEvent.mouseDown(nextField);
      expect(trigger).not.toHaveFocus();
    });
  });

  describe('keyboard day-grid navigation', () => {
    it('moves focus to the next day on ArrowRight and keeps a single roving Tab stop', () => {
      render(
        <BirthDatePicker value="1990-03-10" onChange={vi.fn()} minDate={MIN_DATE} maxDate={MAX_DATE} />,
      );
      fireEvent.click(screen.getByRole('button', { name: /date of birth/i }));
      const day10 = screen.getByRole('button', { name: '10 March 1990' });
      expect(day10).toHaveAttribute('tabindex', '0');

      fireEvent.keyDown(day10, { key: 'ArrowRight' });

      const day11 = screen.getByRole('button', { name: '11 March 1990' });
      expect(day11).toHaveFocus();
      expect(day11).toHaveAttribute('tabindex', '0');
      expect(day10).toHaveAttribute('tabindex', '-1');
    });

    it('crosses a month boundary on ArrowLeft from the 1st', () => {
      render(
        <BirthDatePicker value="1990-03-01" onChange={vi.fn()} minDate={MIN_DATE} maxDate={MAX_DATE} />,
      );
      fireEvent.click(screen.getByRole('button', { name: /date of birth/i }));
      const day1 = screen.getByRole('button', { name: '1 March 1990' });

      fireEvent.keyDown(day1, { key: 'ArrowLeft' });

      expect(screen.getByRole('button', { name: '28 February 1990' })).toHaveFocus();
    });

    it('moves to the start of the week on Home and the end of the week on End', () => {
      render(
        <BirthDatePicker value="1990-03-14" onChange={vi.fn()} minDate={MIN_DATE} maxDate={MAX_DATE} />,
      );
      fireEvent.click(screen.getByRole('button', { name: /date of birth/i }));
      // 1990-03-14 is a Wednesday; its week runs Sun 11 -> Sat 17.
      const day14 = screen.getByRole('button', { name: '14 March 1990' });

      fireEvent.keyDown(day14, { key: 'Home' });
      expect(screen.getByRole('button', { name: '11 March 1990' })).toHaveFocus();

      fireEvent.keyDown(screen.getByRole('button', { name: '11 March 1990' }), { key: 'End' });
      expect(screen.getByRole('button', { name: '17 March 1990' })).toHaveFocus();
    });

    it('steps a month on PageDown/PageUp', () => {
      render(
        <BirthDatePicker value="1990-03-14" onChange={vi.fn()} minDate={MIN_DATE} maxDate={MAX_DATE} />,
      );
      fireEvent.click(screen.getByRole('button', { name: /date of birth/i }));
      const day14 = screen.getByRole('button', { name: '14 March 1990' });

      fireEvent.keyDown(day14, { key: 'PageDown' });
      expect(screen.getByRole('button', { name: '14 April 1990' })).toHaveFocus();

      fireEvent.keyDown(screen.getByRole('button', { name: '14 April 1990' }), { key: 'PageUp' });
      expect(screen.getByRole('button', { name: '14 March 1990' })).toHaveFocus();
    });

    it('selects the focused day and closes on Enter', () => {
      const onChange = vi.fn();
      render(
        <BirthDatePicker value="1990-03-10" onChange={onChange} minDate={MIN_DATE} maxDate={MAX_DATE} />,
      );
      const trigger = screen.getByRole('button', { name: /date of birth/i });
      fireEvent.click(trigger);
      const day10 = screen.getByRole('button', { name: '10 March 1990' });

      fireEvent.keyDown(day10, { key: 'ArrowRight' });
      fireEvent.keyDown(screen.getByRole('button', { name: '11 March 1990' }), { key: 'Enter' });

      expect(onChange).toHaveBeenCalledWith('1990-03-11');
      expect(trigger).toHaveFocus();
    });

    it('does not move focus past the max bound', () => {
      render(
        <BirthDatePicker value="2020-12-31" onChange={vi.fn()} minDate={MIN_DATE} maxDate={MAX_DATE} />,
      );
      fireEvent.click(screen.getByRole('button', { name: /date of birth/i }));
      const day31 = screen.getByRole('button', { name: '31 December 2020' });

      fireEvent.keyDown(day31, { key: 'ArrowRight' });

      // Clamped to the max bound itself, not carried past it.
      expect(screen.getByRole('button', { name: '31 December 2020' })).toHaveFocus();
    });
  });
});

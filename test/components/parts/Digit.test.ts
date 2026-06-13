import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Digit from '@components/parts/Digit.svelte';

// Note on test strategy: Digit renders an overlay <div> with the current character AND a
// <select> with ALL possible options for the base. Querying by text alone (getAllByText)
// is a false positive because every option character is always in the DOM regardless of
// which digit is selected. Tests here use getByRole('option', { selected: true }) to
// assert the SELECTED option, which is the one that actually reflects the digit prop.

describe('Digit', () => {
  it('selected option shows decimal digit 5 as "5"', () => {
    render(Digit, { props: { digit: 5, base: 10, position: 0 } });
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('5');
  });

  it('selected option shows hex digit 10 as "A"', () => {
    render(Digit, { props: { digit: 10, base: 16, position: 0 } });
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('A');
  });

  it('selected option shows hex digit 15 as "F"', () => {
    render(Digit, { props: { digit: 15, base: 16, position: 0 } });
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('F');
  });

  it('selected option shows hex digit 0 as "0"', () => {
    render(Digit, { props: { digit: 0, base: 16, position: 0 } });
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('0');
  });

  it('select element value matches digit prop', () => {
    render(Digit, { props: { digit: 7, base: 16, position: 0 } });
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(Number(select.value)).toBe(7);
  });

  it('select has base number of options', () => {
    render(Digit, { props: { digit: 0, base: 16, position: 0 } });
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.options.length).toBe(16);
  });

  it('select has data-position attribute matching position prop', () => {
    render(Digit, { props: { digit: 0, base: 16, position: 3 } });
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('data-position', '3');
  });

  it('selected option shows binary digit 0 as "0"', () => {
    render(Digit, { props: { digit: 0, base: 2, position: 0 } });
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('0');
  });

  it('selected option shows binary digit 1 as "1"', () => {
    render(Digit, { props: { digit: 1, base: 2, position: 0 } });
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('1');
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import BitHex from '@components/blend/BitHex.svelte';

// BitHex is the critical integration test: it uses bind:integer with both Bits and Digits.
// Flipping a bit in the Bits row must propagate through the bind: chain and update the Digits row.
// This test specifically verifies the two-way binding chain is intact after refactoring.

describe('BitHex', () => {
  it('renders checkboxes (bits) and a select (hex digit)', () => {
    render(BitHex, { props: { integer: 0 } });
    expect(screen.getAllByRole('checkbox').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0);
  });

  it('hex select reflects initial integer value', () => {
    render(BitHex, { props: { integer: 0 } });
    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[];
    const hexValue = selects.reduce(
      (acc, s, i) => acc + Number(s.value) * Math.pow(16, selects.length - 1 - i),
      0
    );
    expect(hexValue).toBe(0);
  });

  it('shows 3 hex selects for integer 255 with values [0, F, F]', () => {
    // extractBit(255) = [0,1,1,1,1,1,1,1,1] (9 bits including leading zero),
    // padded to 12 bits → lengthOfBits=12 → Math.ceil(12/4)=3 hex digits.
    // The leading-zero nibble gives a first select value of 0.
    render(BitHex, { props: { integer: 255 } });
    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[];
    expect(selects).toHaveLength(3);
    expect(Number(selects[0].value)).toBe(0);
    expect(Number(selects[1].value)).toBe(15);
    expect(Number(selects[2].value)).toBe(15);
  });

  it('shows 12 bit cells for integer 255, first 4 unchecked', () => {
    // extractBit(255) = [0,1,...,1] (9 elements) → padded to 12 bits
    // First 4 bits (the leading-zero nibble) are 0; last 8 bits are 1.
    render(BitHex, { props: { integer: 255 } });
    const cbs = screen.getAllByRole('checkbox') as HTMLInputElement[];
    expect(cbs).toHaveLength(12);
    expect(cbs.slice(0, 4).every((cb) => !cb.checked)).toBe(true);
    expect(cbs.slice(4).every((cb) => cb.checked)).toBe(true);
  });

  it('flipping LSB bit from 0 → 1 updates hex digit (bind: chain)', async () => {
    // This is the core integration test:
    // Bit flip → Bits.integer updates → bind:integer propagates to BitHex → Digits re-renders
    const user = userEvent.setup();
    render(BitHex, { props: { integer: 0 } });

    const cbs = screen.getAllByRole('checkbox');
    const selectsBefore = screen.getAllByRole('combobox') as HTMLSelectElement[];
    // All hex selects start at 0
    expect(selectsBefore.every((s) => Number(s.value) === 0)).toBe(true);

    // Flip the LSB
    await user.click(cbs[cbs.length - 1]);

    const selectsAfter = screen.getAllByRole('combobox') as HTMLSelectElement[];
    // The last hex select (LSB nibble) should now be 1
    expect(Number(selectsAfter[selectsAfter.length - 1].value)).toBe(1);
  });

  it('flipping LSB bit from 1 → 0 updates hex digit back to 0', async () => {
    const user = userEvent.setup();
    render(BitHex, { props: { integer: 1 } });

    const cbs = screen.getAllByRole('checkbox');
    const lsb = cbs[cbs.length - 1];
    expect(lsb).toBeChecked();

    await user.click(lsb);

    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[];
    expect(selects.every((s) => Number(s.value) === 0)).toBe(true);
  });

  it('flipping the MSB of integer 0 checks that bit and makes the hex non-zero', async () => {
    // Integer 0 → 4 bits, MSB at index 0 represents 2^3=8.
    // After flip: integer=8, hex select shows 8.
    const user = userEvent.setup();
    render(BitHex, { props: { integer: 0 } });

    const cbs = screen.getAllByRole('checkbox');
    expect(cbs).toHaveLength(4);
    const msb = cbs[0];
    expect(msb).not.toBeChecked();

    await user.click(msb);

    // MSB is now checked
    expect(msb).toBeChecked();

    // integer became 8 = 0x8; hex selects now show non-zero
    const selectsAfter = screen.getAllByRole('combobox') as HTMLSelectElement[];
    const hexValue = selectsAfter.reduce(
      (acc, s, i) => acc + Number(s.value) * Math.pow(16, selectsAfter.length - 1 - i),
      0
    );
    expect(hexValue).toBe(8);
  });
});

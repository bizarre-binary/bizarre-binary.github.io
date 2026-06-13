import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import Bits from '@components/parts/Bits.svelte';

describe('Bits', () => {
  it('renders 8 bit cells for integer 32', () => {
    // Uses 32, not the default prop value (42), to ensure the integer prop is actually received.
    // extractBit(32) = [0,1,0,0,0,0,0] → toBits(32,4) pads to 8 bits.
    render(Bits, { props: { integer: 32 } });
    expect(screen.getAllByRole('checkbox')).toHaveLength(8);
  });

  it('renders 4 bit cells for integer 0 (default multipleOf=4)', () => {
    render(Bits, { props: { integer: 0 } });
    expect(screen.getAllByRole('checkbox')).toHaveLength(4);
  });

  it('shows correct bit pattern for integer 32 (0b00100000)', () => {
    // Uses 32, not the default prop value (42), to ensure the integer prop is actually received.
    // extractBit(32) = [0,1,0,0,0,0,0] → padded to [0,0,1,0,0,0,0,0].
    render(Bits, { props: { integer: 32 } });
    const cbs = screen.getAllByRole('checkbox') as HTMLInputElement[];
    expect(cbs.map((cb) => cb.checked)).toEqual([
      false, false, true, false, false, false, false, false,
    ]);
  });

  it('shows integer 15 as 8 bits with leading zero (0b00001111)', () => {
    // extractBit always adds a leading 0 from its base case, so 15 renders as
    // [0,1,1,1,1] → padded to 8 bits: [0,0,0,0,1,1,1,1]
    render(Bits, { props: { integer: 15 } });
    const cbs = screen.getAllByRole('checkbox') as HTMLInputElement[];
    expect(cbs).toHaveLength(8);
    expect(cbs.map((cb) => cb.checked)).toEqual([
      false, false, false, false, true, true, true, true,
    ]);
  });

  it('shows all unchecked for integer 0', () => {
    render(Bits, { props: { integer: 0 } });
    const cbs = screen.getAllByRole('checkbox') as HTMLInputElement[];
    expect(cbs.every((cb) => !cb.checked)).toBe(true);
  });

  it('ArrowUp on a bit sets it to 1', async () => {
    const user = userEvent.setup();
    render(Bits, { props: { integer: 0 } });
    const cbs = screen.getAllByRole('checkbox');
    const lsb = cbs[cbs.length - 1] as HTMLInputElement;
    lsb.focus();
    await user.keyboard('{ArrowUp}');
    flushSync();
    expect(lsb).toBeChecked();
  });

  it('ArrowDown on a bit sets it to 0', async () => {
    const user = userEvent.setup();
    render(Bits, { props: { integer: 1 } });
    const cbs = screen.getAllByRole('checkbox');
    const lsb = cbs[cbs.length - 1] as HTMLInputElement;
    lsb.focus();
    await user.keyboard('{ArrowDown}');
    flushSync();
    expect(lsb).not.toBeChecked();
  });

  it('disabledBits 0xFFFFFFFF disables all checkboxes', () => {
    render(Bits, { props: { integer: 42, disabledBits: 0xffffffff } });
    const cbs = screen.getAllByRole('checkbox');
    for (const cb of cbs) {
      expect(cb).toBeDisabled();
    }
  });

  it('disabledBits 0 leaves all checkboxes enabled', () => {
    render(Bits, { props: { integer: 42, disabledBits: 0 } });
    const cbs = screen.getAllByRole('checkbox');
    for (const cb of cbs) {
      expect(cb).not.toBeDisabled();
    }
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import Number from '@components/Number.svelte';

// Mock debounce as synchronous: timing is not what we're testing here,
// and the trailing-edge delay prevented reactive updates from flushing
// cleanly in the test environment.
vi.mock('@lib/debounce', () => ({
  debounce: (fn: (...args: unknown[]) => unknown) => fn,
}));

// Integration tests for Number.svelte — the bridge pattern:
//   onControl sets integerInput → $effect.pre clamps → $effect.pre reconsile
//   → integer updates → OctBitHex re-renders via bind:integer.
// This chain is not covered by any lower-level component test.

describe('Number', () => {
  beforeEach(() => localStorage.clear());
  it('renders default integer 42 as bit pattern 0b00101010', () => {
    render(Number);
    const cbs = screen.getAllByRole('checkbox') as HTMLInputElement[];
    // 42 = 0b00101010: LSB unchecked, second-from-last checked
    expect(cbs[cbs.length - 1]).not.toBeChecked();
    expect(cbs[cbs.length - 2]).toBeChecked();
  });

  it('+1 increments integer: LSB flips unchecked → checked (42 → 43)', async () => {
    const user = userEvent.setup();
    render(Number);

    await user.click(screen.getByText('+1'));
    flushSync();

    // 43 = 0b00101011: LSB is now 1
    expect(screen.getAllByRole('checkbox').at(-1)).toBeChecked();
  });

  it('-1 decrements integer: LSB flips back unchecked (43 → 42)', async () => {
    const user = userEvent.setup();
    render(Number);

    await user.click(screen.getByText('+1'));
    flushSync();
    await user.click(screen.getByText('-1'));
    flushSync();

    // Back to 42: LSB is 0
    expect(screen.getAllByRole('checkbox').at(-1)).not.toBeChecked();
  });

  it('min button sets all bits to 0 (integer = 0)', async () => {
    const user = userEvent.setup();
    render(Number);

    const buttons = screen.getAllByRole('button');
    const minBtn = buttons.find((b) => b.textContent?.trim() === 'min')!;
    await user.click(minBtn);
    flushSync();

    const cbs = screen.getAllByRole('checkbox') as HTMLInputElement[];
    expect(cbs.every((cb) => !cb.checked)).toBe(true);
  });

  it('max button sets last 32 bits to all 1s (integer = 0xFFFFFFFF)', async () => {
    const user = userEvent.setup();
    render(Number);

    const buttons = screen.getAllByRole('button');
    const maxBtn = buttons.find((b) => b.textContent?.trim() === 'max')!;
    await user.click(maxBtn);
    flushSync();

    const cbs = screen.getAllByRole('checkbox') as HTMLInputElement[];
    // extractBit(0xFFFFFFFF) pads with a leading zero nibble; last 32 bits are all 1
    expect(cbs.slice(-32).every((cb) => cb.checked)).toBe(true);
  });
});

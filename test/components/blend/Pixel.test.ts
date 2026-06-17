import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import Pixel from '@components/blend/Pixel.svelte';

// Covers the dispatcher → callback-prop migration AND the r/g/b reactive
// initializer pattern. Flips the LSB of R: the visible colorHex/colorNumbers
// must update (proves $derived sees r as a tracked signal) and the onUpdate
// callback must fire with the new value (proves the $effect re-runs).

describe('Pixel', () => {
  it('updates displayed color and fires onUpdate when an R bit is flipped', async () => {
    const onUpdate = vi.fn();
    const user = userEvent.setup();
    const { container } = render(Pixel, {
      props: { pixel: { r: 0, g: 0, b: 0 }, position: 2, onUpdate },
    });
    flushSync();

    const hexEl = container.querySelector('pre.text-3xl')!;
    const numEl = container.querySelector('pre.text-xs')!;
    expect(hexEl.textContent).toBe('#000000');
    expect(numEl.textContent).toBe('(0, 0, 0)');
    // Initial $effect dispatch
    expect(onUpdate).toHaveBeenLastCalledWith({
      rgba: { r: 0, g: 0, b: 0, a: 255 },
      position: 2,
    });

    // 3 sub-pixels × 8 bits = 24 checkboxes; LSB of R sub-pixel is index 7.
    const cbs = screen.getAllByRole('checkbox') as HTMLInputElement[];
    expect(cbs).toHaveLength(24);
    await user.click(cbs[7]);
    flushSync();

    expect(hexEl.textContent).toBe('#010000');
    expect(numEl.textContent).toBe('(1, 0, 0)');
    expect(onUpdate).toHaveBeenLastCalledWith({
      rgba: { r: 1, g: 0, b: 0, a: 255 },
      position: 2,
    });
  });
});

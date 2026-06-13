import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import OpacitySkeleton from '@components/parts/OpacitySkeleton.svelte';

describe('OpacitySkeleton', () => {
  it('renders a wrapper div', () => {
    const { container } = render(OpacitySkeleton);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('applies opacity-100 after mount (onMount fires)', () => {
    const { container } = render(OpacitySkeleton);
    const wrapper = container.firstElementChild as HTMLElement;
    // Before stash: onMount sets mounted=true which adds opacity-100
    // After stash: $effect replaces onMount — same behavior expected
    expect(wrapper).toHaveClass('opacity-100');
  });

  it('has opacity-0 class initially (before transition)', () => {
    // The div has opacity-0 as a static class in addition to the conditional opacity-100
    const { container } = render(OpacitySkeleton);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveClass('opacity-0');
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import Toast from '@components/parts/Toast.svelte';

describe('Toast', () => {
  it('renders the toast container', () => {
    const { container } = render(Toast, { props: { text: null } });
    expect(container.querySelector('.toast')).toBeInTheDocument();
  });

  it('is hidden when text is null', () => {
    const { container } = render(Toast, { props: { text: null } });
    expect(container.querySelector('.toast')).toHaveClass('hidden');
  });

  it('is visible when text is set', () => {
    const { container } = render(Toast, { props: { text: 'hello' } });
    expect(container.querySelector('.toast')).not.toHaveClass('hidden');
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('applies alert type class from type prop', () => {
    const { container } = render(Toast, { props: { text: 'ok', type: 'success' } });
    expect(container.querySelector('.alert-success')).toBeInTheDocument();
  });

  it('defaults to alert-info type', () => {
    const { container } = render(Toast, { props: { text: 'ok' } });
    expect(container.querySelector('.alert-info')).toBeInTheDocument();
  });

  describe('auto-hide', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('hides after durationInSec elapses', async () => {
      const { container } = render(Toast, { props: { text: 'bye', durationInSec: 1 } });
      const toast = container.querySelector('.toast') as HTMLElement;
      expect(toast).not.toHaveClass('hidden');

      vi.advanceTimersByTime(1100);
      flushSync();

      expect(toast).toHaveClass('hidden');
    });

    it('does not hide before durationInSec elapses', () => {
      const { container } = render(Toast, { props: { text: 'stay', durationInSec: 2 } });
      const toast = container.querySelector('.toast') as HTMLElement;

      vi.advanceTimersByTime(1500);
      flushSync();

      expect(toast).not.toHaveClass('hidden');
    });
  });
});

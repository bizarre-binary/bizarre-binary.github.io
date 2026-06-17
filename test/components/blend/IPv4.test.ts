import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import IPv4 from '@components/blend/IPv4.svelte';

// Covers the Svelte 5 migration of IPv4.svelte:
//   - extraBits snippet prop replaces the old `<slot name="extra-bits" />`
//   - IPv4Input pencil button has an aria-label (a11y fix)

describe('IPv4', () => {
  it('renders the pencil button with an accessible label', () => {
    render(IPv4, { props: { address: 0xc0a80000, prefix: 16 } });
    expect(screen.getByRole('button', { name: /edit ipv4 address/i })).toBeInTheDocument();
  });

  it('renders content passed via the extraBits snippet prop', () => {
    const extraBits = createRawSnippet(() => ({
      render: () => '<div data-testid="extra-bits-marker">extra bits content</div>',
    }));
    render(IPv4, { props: { address: 0xc0a80000, prefix: 16, extraBits } });
    expect(screen.getByTestId('extra-bits-marker')).toHaveTextContent('extra bits content');
  });
});

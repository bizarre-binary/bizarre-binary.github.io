import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

const store: Record<string, string> = {};
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => {
      store[k] = v;
    },
    removeItem: (k: string) => {
      delete store[k];
    },
    clear: () => {
      Object.keys(store).forEach((k) => delete store[k]);
    },
  },
});

vi.mock('svelte/transition', () => ({
  fly: () => ({ duration: 0 }),
  fade: () => ({ duration: 0 }),
}));

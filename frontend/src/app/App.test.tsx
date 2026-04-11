import type { ReactNode } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./AppShell', () => ({
  AppShell() {
    return <main data-testid="mock-app-shell" />;
  },
}));

vi.mock('./providers/AppProviders', () => ({
  AppProviders({ children }: { children: ReactNode }) {
    return <>{children}</>;
  },
}));

import { App } from './App';

describe('App', () => {
  it('renders a single main landmark', () => {
    render(<App />);

    expect(screen.getAllByRole('main')).toHaveLength(1);
  });
});

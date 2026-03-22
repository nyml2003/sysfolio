import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { IconButton } from './IconButton';

const base = {
  size: 'md' as const,
  type: 'button' as const,
  loading: false,
};

describe('IconButton', () => {
  it('sets aria-label from srLabel and renders icon', () => {
    render(
      <IconButton {...base} srLabel="Do thing" tone="ghost">
        <span data-testid="ic">icon</span>
      </IconButton>
    );
    const el = screen.getByRole('button', { name: 'Do thing' });
    expect(el.getAttribute('aria-label')).toBe('Do thing');
    expect(screen.getByTestId('ic')).toBeTruthy();
  });

  it('loading shows spinner and aria-busy', () => {
    render(
      <IconButton {...base} loading srLabel="Wait" tone="primary">
        <span data-testid="ic">icon</span>
      </IconButton>
    );
    const el = screen.getByRole('button', { name: 'Wait' });
    expect(el.getAttribute('aria-busy')).toBe('true');
    expect(el.className).toContain('is-loading');
    expect(screen.queryByTestId('ic')).toBeNull();
  });
});

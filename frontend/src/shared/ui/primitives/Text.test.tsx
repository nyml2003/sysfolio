import { render, screen } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import { Text } from './Text';

describe('Text', () => {
  it('renders children', () => {
    render(
      <Text tone="default" variant="ui">
        Hello
      </Text>
    );

    expect(screen.getByText('Hello')).toBeTruthy();
  });

  it('applies variant and tone classes', () => {
    render(
      <Text tone="muted" variant="caption">
        Sub
      </Text>
    );

    const el = screen.getByText('Sub');

    expect(el.className).toContain('sf-text--caption');

    expect(el.className).toContain('sf-text--tone-muted');
  });

  it('sets aria-disabled when tone is disabled', () => {
    render(
      <Text tone="disabled" variant="body">
        Off
      </Text>
    );

    expect(screen.getByText('Off').getAttribute('aria-disabled')).toBe('true');
  });
});

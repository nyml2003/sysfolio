import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { none, some } from '@/shared/lib/monads/option';

import { Heading } from './Heading';

const base = {
  leadingIcon: none(),
  trailingMeta: none(),
};

describe('Heading', () => {
  it('renders semantic level', () => {
    const { container } = render(
      <Heading {...base} level={3} tone="default" variant="section">
        Title
      </Heading>
    );
    expect(container.querySelector('h3')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Title' })).toBeTruthy();
  });

  it('applies variant and tone classes', () => {
    render(
      <Heading {...base} level={2} tone="muted" variant="subsection">
        Sub
      </Heading>
    );
    const el = screen.getByRole('heading', { name: 'Sub' });
    expect(el.className).toContain('sf-heading--subsection');
    expect(el.className).toContain('sf-heading--muted');
  });

  it('renders leading and trailing slots', () => {
    render(
      <Heading
        {...base}
        leadingIcon={some(<span data-testid="lead">icon</span>)}
        level={2}
        tone="default"
        trailingMeta={some(<span data-testid="trail">meta</span>)}
        variant="section"
      >
        Block
      </Heading>
    );
    expect(screen.getByTestId('lead')).toBeTruthy();
    expect(screen.getByTestId('trail')).toBeTruthy();
    expect(screen.getByRole('heading').className).toContain('sf-heading--has-affix');
  });
});

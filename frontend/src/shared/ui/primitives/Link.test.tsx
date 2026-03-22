import { render, screen } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import { none, some } from '@/shared/lib/monads/option';

import { Link } from './Link';

const base = {
  leadingIcon: none(),

  trailingIcon: none(),
};

describe('Link', () => {
  it('renders anchor with href', () => {
    render(
      <Link {...base} href="/docs" variant="default">
        Docs
      </Link>
    );

    const el = screen.getByRole('link', { name: 'Docs' });

    expect(el.getAttribute('href')).toBe('/docs');
  });

  it('applies variant class', () => {
    render(
      <Link {...base} href="#" variant="subtle">
        Sub
      </Link>
    );

    expect(screen.getByRole('link').className).toContain('sf-link--subtle');
  });

  it('sets aria-current when current', () => {
    render(
      <Link {...base} current href="#" variant="default">
        Here
      </Link>
    );

    expect(screen.getByRole('link').getAttribute('aria-current')).toBe('page');
  });

  it('renders leading icon when some', () => {
    render(
      <Link
        {...base}
        href="#"
        leadingIcon={some(<span data-testid="lead">i</span>)}
        variant="default"
      >
        L
      </Link>
    );

    expect(screen.getByTestId('lead')).toBeTruthy();

    expect(screen.getByRole('link').className).toContain('sf-link--has-affix');
  });

  it('renders default external mark when variant external and no trailingIcon', () => {
    render(
      <Link {...base} href="https://example.com" variant="external">
        Out
      </Link>
    );

    expect(screen.getByText('↗')).toBeTruthy();
  });
});

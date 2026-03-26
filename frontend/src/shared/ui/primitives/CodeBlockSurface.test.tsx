import { render, screen } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import { none, some } from '@/shared/lib/monads/option';

import { CodeBlockSurface } from './CodeBlockSurface';

const emptySlots = {
  header: none(),

  language: none(),

  meta: none(),

  actions: none(),

  footer: none(),
};

describe('CodeBlockSurface', () => {
  it('renders code string with pre/code shell classes', () => {
    const { container } = render(
      <CodeBlockSurface {...emptySlots} code="const x = 1;" scrollable={false} variant="default" />
    );

    expect(container.querySelector('.sf-code-block-surface__pre')).toBeTruthy();

    expect(container.querySelector('.sf-code-block-surface__code')).toBeTruthy();

    expect(screen.getByText('const x = 1;')).toBeTruthy();
  });

  it('renders body', () => {
    render(
      <CodeBlockSurface {...emptySlots} scrollable={false} variant="default">
        <pre>
          <code>hello</code>
        </pre>
      </CodeBlockSurface>
    );

    expect(screen.getByText('hello')).toBeTruthy();
  });

  it('applies variant class', () => {
    const { container } = render(
      <CodeBlockSurface {...emptySlots} scrollable={false} variant="command">
        <pre>
          <code>x</code>
        </pre>
      </CodeBlockSurface>
    );

    expect(container.querySelector('.sf-code-block-surface--command')).toBeTruthy();
  });

  it('shows language in header when some', () => {
    render(
      <CodeBlockSurface {...emptySlots} language={some('tsx')} scrollable={false} variant="default">
        <pre>
          <code />
        </pre>
      </CodeBlockSurface>
    );

    expect(screen.getByText('tsx')).toBeTruthy();
  });

  it('adds wrapped modifiers when lineWrap', () => {
    const { container } = render(
      <CodeBlockSurface {...emptySlots} lineWrap scrollable={false} variant="default">
        <pre>
          <code>y</code>
        </pre>
      </CodeBlockSurface>
    );

    expect(container.querySelector('.sf-code-block-surface--wrapped')).toBeTruthy();

    expect(container.querySelector('.sf-code-block-surface__body--wrapped')).toBeTruthy();
  });
});

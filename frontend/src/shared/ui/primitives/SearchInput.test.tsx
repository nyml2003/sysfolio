import { render, screen } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import { none, some } from '@/shared/lib/monads/option';

import { SearchInput } from './SearchInput';

const emptySlots = {
  leadingSearchIcon: none(),

  clear: none(),

  submit: none(),

  scope: none(),
};

describe('SearchInput', () => {
  it('renders search input', () => {
    render(<SearchInput {...emptySlots} placeholder="Find…" variant="default" />);

    expect(screen.getByRole('searchbox')).toBeTruthy();
  });

  it('applies variant class', () => {
    const { container } = render(<SearchInput {...emptySlots} placeholder="x" variant="subtle" />);

    expect(container.querySelector('.sf-search-input--subtle')).toBeTruthy();
  });

  it('sets filled when value is non-empty', () => {
    const { container } = render(
      <SearchInput {...emptySlots} value="hi" variant="default" onChange={() => {}} />
    );

    expect(container.querySelector('.sf-search-input--filled')).toBeTruthy();
  });

  it('renders clear slot when some', () => {
    render(
      <SearchInput
        {...emptySlots}
        clear={some(<span data-testid="clear">×</span>)}
        variant="default"
      />
    );

    expect(screen.getByTestId('clear')).toBeTruthy();
  });
});

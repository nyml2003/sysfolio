import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { none, some } from '@/shared/lib/monads/option';

import { NumberInput } from './NumberInput';

const emptySlots = {
  stepDown: none(),
  stepUp: none(),
  prefixSlot: none(),
  suffixSlot: none(),
};

describe('NumberInput', () => {
  it('renders number input and built-in step buttons', () => {
    const { container } = render(
      <NumberInput {...emptySlots} defaultValue={0} variant="default" />
    );
    expect(container.querySelector('input[type="number"]')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Increase' })).toBeTruthy();
  });

  it('applies variant class', () => {
    const { container } = render(
      <NumberInput {...emptySlots} defaultValue={1} variant="invalid" />
    );
    expect(container.querySelector('.sf-number-input--invalid')).toBeTruthy();
  });

  it('increments controlled value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberInput {...emptySlots} value={2} variant="default" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Increase' }));
    expect(onChange).toHaveBeenCalled();
    const first = onChange.mock.calls[0][0];
    expect(first.target.value).toBe('3');
  });

  it('renders custom step slot when some', () => {
    render(
      <NumberInput
        {...emptySlots}
        stepDown={some(<span data-testid="down">d</span>)}
        variant="default"
      />
    );
    expect(screen.getByTestId('down')).toBeTruthy();
  });
});

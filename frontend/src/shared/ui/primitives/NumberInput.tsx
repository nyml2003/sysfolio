import { forwardRef, useCallback, useRef, type ChangeEvent } from 'react';

import { clsx } from 'clsx';

import { isSome } from '@/shared/lib/monads/option';

import type { NumberInputProps } from './number-input.types';

function parseStep(el: HTMLInputElement): number {
  const s = el.step;
  if (s === '' || s === undefined) {
    return 1;
  }
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function parseOptionalBound(el: HTMLInputElement, attr: 'min' | 'max'): number | undefined {
  const raw = el.getAttribute(attr);
  if (raw === null || raw === '') {
    return undefined;
  }
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

function clampValue(n: number, min?: number, max?: number): number {
  let x = n;
  if (min !== undefined && !Number.isNaN(min)) {
    x = Math.max(min, x);
  }
  if (max !== undefined && !Number.isNaN(max)) {
    x = Math.min(max, x);
  }
  return x;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput(props, ref) {
    const {
      variant,
      loading = false,
      stepDown,
      stepUp,
      prefixSlot,
      suffixSlot,
      decrementAriaLabel = 'Decrease',
      incrementAriaLabel = 'Increase',
      className,
      disabled,
      readOnly,
      ...inputProps
    } = props;

    const { value, onChange, name, id } = inputProps;

    const innerRef = useRef<HTMLInputElement>(null);

    const setRefs = useCallback(
      (el: HTMLInputElement | null) => {
        innerRef.current = el;
        if (typeof ref === 'function') {
          ref(el);
        } else if (ref) {
          ref.current = el;
        }
      },
      [ref]
    );

    const nudge = useCallback(
      (direction: -1 | 1) => {
        const el = innerRef.current;
        if (!el || disabled || readOnly) {
          return;
        }

        const stepNum = parseStep(el);
        const minNum = parseOptionalBound(el, 'min');
        const maxNum = parseOptionalBound(el, 'max');

        if (value !== undefined) {
          const raw = String(value);
          const current = raw === '' ? 0 : Number(raw);
          const base = Number.isFinite(current) ? current : 0;
          const next = clampValue(base + direction * stepNum, minNum, maxNum);
          const nextStr = String(next);
          const synthetic = {
            target: { value: nextStr, name, id },
            currentTarget: el,
          } as ChangeEvent<HTMLInputElement>;
          onChange?.(synthetic);
          return;
        }

        const current = el.value === '' ? 0 : Number(el.value);
        const base = Number.isFinite(current) ? current : 0;
        const next = clampValue(base + direction * stepNum, minNum, maxNum);
        el.value = String(next);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      },
      [disabled, readOnly, value, onChange, name, id]
    );

    return (
      <div
        className={clsx(
          'sf-number-input',
          `sf-number-input--${variant}`,
          loading && 'sf-number-input--loading',
          disabled && 'sf-number-input--disabled',
          readOnly && 'sf-number-input--read-only',
          className
        )}
      >
        {isSome(prefixSlot) ? (
          <span className="sf-number-input__prefix">{prefixSlot.value}</span>
        ) : null}
        <input
          ref={setRefs}
          {...inputProps}
          aria-busy={loading || undefined}
          className="sf-number-input__control"
          disabled={disabled}
          readOnly={readOnly}
          type="number"
        />
        {isSome(suffixSlot) ? (
          <span className="sf-number-input__suffix">{suffixSlot.value}</span>
        ) : null}
        {loading ? <span aria-hidden className="sf-number-input__spinner" /> : null}
        <div className="sf-number-input__steps">
          {isSome(stepDown) ? (
            <span className="sf-number-input__step-slot">{stepDown.value}</span>
          ) : (
            <button
              aria-label={decrementAriaLabel}
              className="sf-number-input__step"
              disabled={disabled || readOnly}
              type="button"
              onClick={() => nudge(-1)}
            >
              −
            </button>
          )}
          {isSome(stepUp) ? (
            <span className="sf-number-input__step-slot">{stepUp.value}</span>
          ) : (
            <button
              aria-label={incrementAriaLabel}
              className="sf-number-input__step"
              disabled={disabled || readOnly}
              type="button"
              onClick={() => nudge(1)}
            >
              +
            </button>
          )}
        </div>
      </div>
    );
  }
);

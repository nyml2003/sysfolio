import { clsx } from 'clsx';

import { isSome } from '@/shared/lib/monads/option';

import type { LabelProps } from './label.types';

export function Label({
  variant,
  state,
  htmlFor,
  requiredMark,
  optionalMark,
  infoAffordance,
  children,
  className,
  ...rest
}: LabelProps) {
  const disabled = state === 'disabled';
  const showRequired = state === 'required';
  const showOptional = state === 'optional';

  const requiredContent = showRequired ? (
    isSome(requiredMark) ? (
      requiredMark.value
    ) : (
      <span aria-hidden className="sf-label__required">
        *
      </span>
    )
  ) : (
    false
  );

  const optionalContent = showOptional && isSome(optionalMark) ? optionalMark.value : false;

  const inner = (
    <span className="sf-label__inner">
      <span className="sf-label__content">{children}</span>
      {requiredContent}
      {optionalContent ? <span className="sf-label__optional">{optionalContent}</span> : false}
      {isSome(infoAffordance) ? (
        <span className="sf-label__info">{infoAffordance.value}</span>
      ) : (
        false
      )}
    </span>
  );

  const rootClassName = clsx(
    'sf-label',
    `sf-label--${variant}`,
    disabled && 'sf-label--disabled',
    showRequired && 'sf-label--is-required',
    showOptional && 'sf-label--is-optional',
    className
  );

  const common = {
    ...rest,
    className: rootClassName,
    ...(disabled ? { 'aria-disabled': true as const } : {}),
  };

  if (isSome(htmlFor)) {
    return (
      <label htmlFor={htmlFor.value} {...common}>
        {inner}
      </label>
    );
  }

  return <span {...common}>{inner}</span>;
}

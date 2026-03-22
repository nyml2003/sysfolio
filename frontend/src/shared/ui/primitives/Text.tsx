import { clsx } from 'clsx';

import type { TextProps } from './text.types';

export function Text({ variant, tone, className, children, ...rest }: TextProps) {
  const disabled = tone === 'disabled';

  return (
    <span
      className={clsx('sf-text', `sf-text--${variant}`, `sf-text--tone-${tone}`, className)}
      {...(disabled ? { 'aria-disabled': true as const } : {})}
      {...rest}
    >
      {children}
    </span>
  );
}

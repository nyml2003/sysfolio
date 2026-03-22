import { forwardRef } from 'react';

import { clsx } from 'clsx';

import { isSome } from '@/shared/lib/monads/option';

import type { LinkProps } from './link.types';

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(props, ref) {
  const {
    href,

    variant,

    leadingIcon,

    trailingIcon,

    current,

    children,

    className,

    'aria-current': ariaCurrentFromProps,

    ...rest
  } = props;

  const trailingSlot = isSome(trailingIcon) ? (
    trailingIcon.value
  ) : variant === 'external' ? (
    <span aria-hidden className="sf-link__external-mark">
      ↗
    </span>
  ) : null;

  const showLeading = isSome(leadingIcon);

  const showTrailing = trailingSlot !== null;

  const affix = showLeading || showTrailing;

  return (
    <a
      ref={ref}
      {...rest}
      className={clsx(
        'sf-link',

        `sf-link--${variant}`,

        current && 'sf-link--current',

        affix && 'sf-link--has-affix',

        className
      )}
      href={href}
      aria-current={current ? 'page' : ariaCurrentFromProps}
    >
      {showLeading ? (
        <span aria-hidden className="sf-link__leading">
          {leadingIcon.value}
        </span>
      ) : null}

      <span className="sf-link__label">{children}</span>

      {showTrailing ? (
        <span aria-hidden className="sf-link__trailing">
          {trailingSlot}
        </span>
      ) : null}
    </a>
  );
});

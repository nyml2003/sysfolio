import { forwardRef } from "react";

import { clsx } from "clsx";

import type { IconButtonProps } from "./icon-button.types";

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  props,
  ref,
) {
  const { children, tone, size, type, loading, srLabel, className, disabled, ...rest } = props;

  const isDisabled = Boolean(disabled);
  const effectiveDisabled = loading || isDisabled;

  return (
    <button
      ref={ref}
      {...rest}
      type={type}
      aria-label={srLabel}
      aria-busy={loading}
      className={clsx(
        "sf-icon-button",
        `sf-icon-button--${tone}`,
        `sf-icon-button--${size}`,
        loading && "sf-icon-button--loading",
        loading && "is-loading",
        className,
      )}
      disabled={effectiveDisabled}
    >
      <span aria-hidden className="sf-icon-button__surface">
        {loading ? <span className="sf-button__spinner" /> : children}
      </span>
    </button>
  );
});

IconButton.displayName = "IconButton";

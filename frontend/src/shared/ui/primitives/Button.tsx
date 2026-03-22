import { forwardRef } from "react";

import { clsx } from "clsx";

import { isSome } from "@/shared/lib/monads/option";

import type { ButtonProps } from "./button.types";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    children,
    tone,
    size,
    type,
    loading,
    fullWidth,
    truncateLabel,
    leadingIcon,
    trailingIcon,
    className,
    disabled,
    ...rest
  } = props;

  const isDisabled = Boolean(disabled);
  const effectiveDisabled = loading || isDisabled;
  const showLeading = loading || isSome(leadingIcon);
  const showTrailing = isSome(trailingIcon) && !loading;
  const useAffixLayout = showLeading || showTrailing;
  const labelEl = <span className="sf-button__label">{children}</span>;

  const content = useAffixLayout ? (
    <>
      {showLeading ? (
        <span aria-hidden className="sf-button__leading">
          {loading ? (
            <span className="sf-button__spinner" />
          ) : isSome(leadingIcon) ? (
            leadingIcon.value
          ) : (
            false
          )}
        </span>
      ) : (
        false
      )}
      {labelEl}
      {showTrailing ? (
        <span aria-hidden className="sf-button__trailing">
          {isSome(trailingIcon) ? trailingIcon.value : false}
        </span>
      ) : (
        false
      )}
    </>
  ) : truncateLabel ? (
    labelEl
  ) : (
    children
  );

  return (
    <button
      ref={ref}
      {...rest}
      type={type}
      className={clsx(
        "sf-button",
        `sf-button--${tone}`,
        `sf-button--${size}`,
        useAffixLayout && "sf-button--has-affix",
        fullWidth && "sf-button--full-width",
        truncateLabel && "sf-button--truncate",
        loading && "sf-button--loading",
        loading && "is-loading",
        className,
      )}
      disabled={effectiveDisabled}
      aria-busy={loading}
    >
      {content}
    </button>
  );
});

Button.displayName = "Button";

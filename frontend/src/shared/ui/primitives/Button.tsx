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
      <span className="sf-button__label">{children}</span>
      {showTrailing ? (
        <span aria-hidden className="sf-button__trailing">
          {isSome(trailingIcon) ? trailingIcon.value : false}
        </span>
      ) : (
        false
      )}
    </>
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
        loading && "sf-button--loading",
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

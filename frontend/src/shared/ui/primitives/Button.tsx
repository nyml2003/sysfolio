import { forwardRef } from "react";

import { clsx } from "clsx";

import type { ButtonProps } from "./button.types";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, tone = "secondary", size = "md", className, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={clsx("sf-button", `sf-button--${tone}`, `sf-button--${size}`, className)}
      type={type}
      {...rest}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

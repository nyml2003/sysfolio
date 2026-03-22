import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { clsx } from "clsx";

type ButtonTone = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  tone?: ButtonTone;
  size?: ButtonSize;
  children: ReactNode;
};

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

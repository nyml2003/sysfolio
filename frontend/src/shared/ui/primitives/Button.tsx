import type { ButtonHTMLAttributes, ReactNode } from "react";

import { clsx } from "clsx";

type ButtonTone = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  tone?: ButtonTone;
  size?: ButtonSize;
};

export function Button({
  children,
  tone = "secondary",
  size = "md",
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx("sf-button", `sf-button--${tone}`, `sf-button--${size}`, className)}
      type={type}
      {...rest}
    >
      {children}
    </button>
  );
}


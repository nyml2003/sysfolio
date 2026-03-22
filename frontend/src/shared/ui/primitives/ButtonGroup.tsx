import { forwardRef } from "react";

import { clsx } from "clsx";

import { Button } from "./Button";
import type { ButtonGroupItemProps, ButtonGroupProps } from "./button-group.types";

export function ButtonGroup({ label, variant, children, className }: ButtonGroupProps) {
  return (
    <div
      aria-label={label}
      className={clsx("sf-button-group", variant === "attached" && "sf-button-group--attached", className)}
      role="group"
    >
      {children}
    </div>
  );
}

export const ButtonGroupItem = forwardRef<HTMLButtonElement, ButtonGroupItemProps>(
  function ButtonGroupItem({ current, className, ...rest }, ref) {
    return (
      <Button
        ref={ref}
        {...rest}
        {...(typeof current === "boolean" ? { "aria-pressed": current } : {})}
        className={clsx("sf-button-group__item", current && "sf-button-group__item--current", className)}
      />
    );
  },
);

ButtonGroupItem.displayName = "ButtonGroupItem";

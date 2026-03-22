import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { clsx } from "clsx";

type InlineGap = "xs" | "sm" | "md" | "lg";
type InlineAlign = "start" | "center" | "between";

type InlineProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  gap?: InlineGap;
  align?: InlineAlign;
  wrap?: boolean;
  className?: string;
};

const gapClassNameByGap: Record<InlineGap, string> = {
  xs: "sf-inline--gap-xs",
  sm: "sf-inline--gap-sm",
  md: "sf-inline--gap-md",
  lg: "sf-inline--gap-lg",
};

const alignClassNameByAlign: Record<InlineAlign, string> = {
  start: "sf-inline--align-start",
  center: "sf-inline--align-center",
  between: "sf-inline--align-between",
};

export function Inline<T extends ElementType = "div">({
  as,
  children,
  gap = "md",
  align = "start",
  wrap = false,
  className,
  ...rest
}: InlineProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof InlineProps<T>>) {
  const Component = as ?? "div";

  return (
    <Component
      className={clsx(
        "sf-inline",
        gapClassNameByGap[gap],
        alignClassNameByAlign[align],
        wrap && "sf-inline--wrap",
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}


import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonTone = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  tone?: ButtonTone;
  size?: ButtonSize;
  children: ReactNode;
};

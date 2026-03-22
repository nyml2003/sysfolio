import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type IconButtonTone = "primary" | "ghost" | "success" | "warning" | "destructive";
export type IconButtonSize = "sm" | "md";

/** catalog：icon / srLabel / spinner；与 Button 一样显式传入自有字段或由 createIconButtonPreset 注入。 */
export type IconButtonOwnProps = {
  tone: IconButtonTone;
  size: IconButtonSize;
  type: "button" | "submit" | "reset";
  loading: boolean;
  /** 屏幕阅读器名称（映射为 aria-label） */
  srLabel: string;
  children: NonNullable<ReactNode>;
};

export type IconButtonProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "type" | "children" | "aria-label" | "aria-busy"
> &
  IconButtonOwnProps;

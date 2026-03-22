import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { Option } from "@/shared/lib/monads/option";

export type ButtonTone = "primary" | "secondary" | "ghost" | "success" | "warning" | "destructive";
export type ButtonSize = "sm" | "md";

/** 前后缀插槽：`none()` 表示无；有内容用 `some(…)`。 */
export type ButtonAffixSlot = Option<NonNullable<ReactNode>>;

/** 与 primitive-component-catalog 对齐的自有字段：须显式传入或由 createButtonPreset 闭包注入。 */
export type ButtonOwnProps = {
  tone: ButtonTone;
  size: ButtonSize;
  type: "button" | "submit" | "reset";
  loading: boolean;
  /** 块级宽度（表单、空态等）。 */
  fullWidth: boolean;
  /** 长文案单行省略（catalog：长文本截断）。 */
  truncateLabel: boolean;
  leadingIcon: ButtonAffixSlot;
  trailingIcon: ButtonAffixSlot;
  children: NonNullable<ReactNode>;
};

export type ButtonProps = Omit<ComponentPropsWithoutRef<"button">, "type" | "children"> & ButtonOwnProps;

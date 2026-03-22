import { forwardRef } from "react";

import { Button } from "./Button";
import type { ButtonOwnProps, ButtonProps } from "./button.types";

/**
 * 用闭包预绑部分 `ButtonOwnProps`；未绑定的字段仍须传入，已绑定的字段可被 props 覆盖。
 */
export function createButtonPreset<const D extends Partial<ButtonOwnProps>>(defaults: D) {
  type PresetKey = keyof D & keyof ButtonOwnProps;

  return forwardRef<
    HTMLButtonElement,
    Omit<ButtonProps, PresetKey> & Partial<Pick<ButtonProps, PresetKey>>
  >(function PresetButton(props, ref) {
    return <Button ref={ref} {...({ ...defaults, ...props } as ButtonProps)} />;
  });
}

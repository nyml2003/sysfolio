import { forwardRef } from 'react';

import { IconButton } from './IconButton';
import type { IconButtonOwnProps, IconButtonProps } from './icon-button.types';

/**
 * 用闭包预绑部分 `IconButtonOwnProps`；未绑定的字段仍须传入，已绑定的字段可被 props 覆盖。
 */
export function createIconButtonPreset<const D extends Partial<IconButtonOwnProps>>(defaults: D) {
  type PresetKey = keyof D & keyof IconButtonOwnProps;

  return forwardRef<
    HTMLButtonElement,
    Omit<IconButtonProps, PresetKey> & Partial<Pick<IconButtonProps, PresetKey>>
  >(function PresetIconButton(props, ref) {
    return <IconButton ref={ref} {...({ ...defaults, ...props } as IconButtonProps)} />;
  });
}

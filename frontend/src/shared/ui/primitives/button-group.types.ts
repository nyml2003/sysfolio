import type { ReactNode } from 'react';

import type { ButtonProps } from './button.types';

export type ButtonGroupVariant = 'default' | 'attached';

export type ButtonGroupProps = {
  /** 用于 role="group" 的可访问名称 */
  label: string;
  variant: ButtonGroupVariant;
  children: ReactNode;
  className?: string;
};

export type ButtonGroupItemProps = ButtonProps & {
  /** 分段/模式切换时与 aria-pressed 对齐；不传则不设置 pressed。 */
  current?: boolean;
};

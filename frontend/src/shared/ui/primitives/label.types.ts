import type { HTMLAttributes, ReactNode } from 'react';

import type { Option } from '@/shared/lib/monads/option';

export type LabelVariant = 'default' | 'strong' | 'subtle';

/** catalog：default / disabled / required / optional */
export type LabelState = 'default' | 'disabled' | 'required' | 'optional';

export type LabelOwnProps = {
  variant: LabelVariant;
  state: LabelState;
  /** 关联控件 id；无则渲染为 span（非 label 元素）。 */
  htmlFor: Option<string>;
  /** state 为 required 时显示；`none()` 时使用默认星号。 */
  requiredMark: Option<NonNullable<ReactNode>>;
  /** state 为 optional 时显示；须由上层 i18n 注入，未传则不渲染占位。 */
  optionalMark: Option<NonNullable<ReactNode>>;
  /** 右侧信息入口（图标按钮等），无则 `none()`。 */
  infoAffordance: Option<NonNullable<ReactNode>>;
  children: NonNullable<ReactNode>;
};

export type LabelProps = LabelOwnProps & Omit<HTMLAttributes<HTMLElement>, 'children'>;

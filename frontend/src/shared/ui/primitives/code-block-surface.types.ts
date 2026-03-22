import type { HTMLAttributes, ReactNode } from 'react';

import type { Option } from '@/shared/lib/monads/option';

/** primitive-component-catalog：default / command / diff-neutral */

export type CodeBlockSurfaceVariant = 'default' | 'command' | 'diff-neutral';

export type CodeBlockSurfaceOwnProps = {
  variant: CodeBlockSurfaceVariant;

  /** 与 catalog「wrapped」状态对齐：长行在块内换行。 */

  lineWrap?: boolean;

  /** 与 catalog「scrollable」状态对齐：横向滚动承载长行（与 lineWrap 互斥时以前者为准）。 */

  scrollable?: boolean;

  header: Option<NonNullable<ReactNode>>;

  language: Option<string>;

  meta: Option<NonNullable<ReactNode>>;

  actions: Option<NonNullable<ReactNode>>;

  footer: Option<NonNullable<ReactNode>>;

  /** body 插槽：通常传入带 `sf-code-block-surface__pre` / `__code` 的 pre/code。 */

  children: NonNullable<ReactNode>;
};

export type CodeBlockSurfaceProps = CodeBlockSurfaceOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

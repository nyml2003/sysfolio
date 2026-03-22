import type { HTMLAttributes, ReactNode } from 'react';

import type { Option } from '@/shared/lib/monads/option';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** primitive-component-catalog：display / section / subsection / caption-heading */
export type HeadingVariant = 'display' | 'section' | 'subsection' | 'caption-heading';

/** default / current / muted */
export type HeadingTone = 'default' | 'current' | 'muted';

export type HeadingOwnProps = {
  /** 语义层级 h1–h6；视觉由 variant 决定。 */
  level: HeadingLevel;
  variant: HeadingVariant;
  tone: HeadingTone;
  leadingIcon: Option<NonNullable<ReactNode>>;
  trailingMeta: Option<NonNullable<ReactNode>>;
  children: NonNullable<ReactNode>;
};

export type HeadingProps = HeadingOwnProps & Omit<HTMLAttributes<HTMLHeadingElement>, 'children'>;

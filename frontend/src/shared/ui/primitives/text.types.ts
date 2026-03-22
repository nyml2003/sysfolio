import type { HTMLAttributes, ReactNode } from 'react';

/** primitive-component-catalog：ui / body / strong / subtle / caption / mono */

export type TextVariant = 'ui' | 'body' | 'strong' | 'subtle' | 'caption' | 'mono';

/** default / muted / success / warning / destructive / disabled */

export type TextTone = 'default' | 'muted' | 'success' | 'warning' | 'destructive' | 'disabled';

export type TextOwnProps = {
  variant: TextVariant;

  tone: TextTone;

  children: NonNullable<ReactNode>;
};

export type TextProps = TextOwnProps & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;

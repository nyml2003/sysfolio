import type { AnchorHTMLAttributes, ReactNode } from 'react';

import type { Option } from '@/shared/lib/monads/option';

/** primitive-component-catalog：default / subtle / external */

export type LinkVariant = 'default' | 'subtle' | 'external';

export type LinkOwnProps = {
  href: string;

  variant: LinkVariant;

  leadingIcon: Option<NonNullable<ReactNode>>;

  trailingIcon: Option<NonNullable<ReactNode>>;

  /** 导航上下文的当前项（catalog current 状态；设置 aria-current）。 */

  current?: boolean;

  children: NonNullable<ReactNode>;
};

export type LinkProps = LinkOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'>;

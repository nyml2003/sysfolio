import type { InputHTMLAttributes, ReactNode } from 'react';

import type { Option } from '@/shared/lib/monads/option';

/** primitive-component-catalog：default / subtle */

export type SearchInputVariant = 'default' | 'subtle';

export type SearchInputOwnProps = {
  variant: SearchInputVariant;

  /** catalog spinner 状态；为 true 时展示内置旋转指示并设置 aria-busy。 */

  loading?: boolean;

  leadingSearchIcon: Option<NonNullable<ReactNode>>;

  clear: Option<NonNullable<ReactNode>>;

  submit: Option<NonNullable<ReactNode>>;

  scope: Option<NonNullable<ReactNode>>;
};

export type SearchInputProps = SearchInputOwnProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>;

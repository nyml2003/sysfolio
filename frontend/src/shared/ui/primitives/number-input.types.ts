import type { InputHTMLAttributes, ReactNode } from 'react';

import type { Option } from '@/shared/lib/monads/option';

/** primitive-component-catalog：default / invalid / warning / success */
export type NumberInputVariant = 'default' | 'invalid' | 'warning' | 'success';

export type NumberInputOwnProps = {
  variant: NumberInputVariant;
  loading?: boolean;
  stepDown: Option<NonNullable<ReactNode>>;
  stepUp: Option<NonNullable<ReactNode>>;
  /** 避免与 DOM `prefix` 属性冲突；catalog 的 prefix 槽。 */
  prefixSlot: Option<NonNullable<ReactNode>>;
  /** catalog 的 suffix 槽。 */
  suffixSlot: Option<NonNullable<ReactNode>>;
  /** 内置步进按钮的可访问名称（i18n）。 */
  decrementAriaLabel?: string;
  incrementAriaLabel?: string;
};

export type NumberInputProps = NumberInputOwnProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'prefix' | 'suffix'>;

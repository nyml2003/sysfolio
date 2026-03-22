import { none } from '@/shared/lib/monads/option';

import { createButtonPreset } from './button-factory';

/** 工具栏 / 树行 / 弱操作：ghost + md */
export const ButtonGhostMd = createButtonPreset({
  tone: 'ghost',
  size: 'md',
  type: 'button',
  loading: false,
  fullWidth: false,
  truncateLabel: false,
  leadingIcon: none(),
  trailingIcon: none(),
});

/** 顶栏等密区域：ghost + sm */
export const ButtonGhostSm = createButtonPreset({
  tone: 'ghost',
  size: 'sm',
  type: 'button',
  loading: false,
  fullWidth: false,
  truncateLabel: false,
  leadingIcon: none(),
  trailingIcon: none(),
});

/** 常规块内操作：secondary + md */
export const ButtonSecondaryMd = createButtonPreset({
  tone: 'secondary',
  size: 'md',
  type: 'button',
  loading: false,
  fullWidth: false,
  truncateLabel: false,
  leadingIcon: none(),
  trailingIcon: none(),
});

/** 密区域次操作：secondary + sm */
export const ButtonSecondarySm = createButtonPreset({
  tone: 'secondary',
  size: 'sm',
  type: 'button',
  loading: false,
  fullWidth: false,
  truncateLabel: false,
  leadingIcon: none(),
  trailingIcon: none(),
});

/** 单屏主 CTA：primary + md */
export const ButtonPrimaryMd = createButtonPreset({
  tone: 'primary',
  size: 'md',
  type: 'button',
  loading: false,
  fullWidth: false,
  truncateLabel: false,
  leadingIcon: none(),
  trailingIcon: none(),
});

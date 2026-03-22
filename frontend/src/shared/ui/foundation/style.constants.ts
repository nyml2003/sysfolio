import { DEFAULT_LAYOUT_MODE, type LayoutMode } from '@/shared/lib/style/style.types';

export const STYLE_LAYOUT_BREAKPOINTS = {
  medium: 1480,
  compact: 980,
} as const;

export const STYLE_SCOPE_CLASS_NAME = 'sf-style-scope';

export const STYLE_LAYOUT_MODE_CLASS_NAMES: Record<LayoutMode, string> = {
  spacious: 'sf-layout-spacious',
  medium: 'sf-layout-medium',
  compact: 'sf-layout-compact',
};

export const INITIAL_LAYOUT_MODE = DEFAULT_LAYOUT_MODE;

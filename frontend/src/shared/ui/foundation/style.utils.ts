import type { MotionMode } from "@/shared/lib/style/style.types";
import type { LayoutMode } from "@/shared/lib/style/style.types";

import { STYLE_LAYOUT_BREAKPOINTS } from "./style.constants";

export function resolveLayoutModeFromWidth(width: number): LayoutMode {
  if (width <= STYLE_LAYOUT_BREAKPOINTS.compact) {
    return "compact";
  }

  if (width <= STYLE_LAYOUT_BREAKPOINTS.medium) {
    return "medium";
  }

  return "spacious";
}

export function resolveMotionMode(
  mediaQueryMatchesReducedMotion: boolean,
): MotionMode {
  return mediaQueryMatchesReducedMotion ? "reduced" : "full";
}


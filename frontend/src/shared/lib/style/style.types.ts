import type { ThemePreference } from "@/shared/lib/theme/theme.types";

export type DensityPreference = "comfortable" | "medium" | "compact";
export type LayoutMode = "spacious" | "medium" | "compact";
export type MotionMode = "full" | "reduced";

export type ResolvedStyleContextValue = {
  theme: ThemePreference;
  density: DensityPreference;
  layoutMode: LayoutMode;
  motion: MotionMode;
};

export const DEFAULT_DENSITY: DensityPreference = "comfortable";
export const DEFAULT_LAYOUT_MODE: LayoutMode = "spacious";
export const DEFAULT_MOTION_MODE: MotionMode = "full";

export const DENSITY_PREFERENCES: readonly DensityPreference[] = [
  "comfortable",
  "medium",
  "compact",
];


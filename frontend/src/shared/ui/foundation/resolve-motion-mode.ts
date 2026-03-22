import type { MotionMode } from "@/shared/lib/style/style.types";

export function resolveMotionMode(
  mediaQueryMatchesReducedMotion: boolean,
): MotionMode {
  return mediaQueryMatchesReducedMotion ? "reduced" : "full";
}

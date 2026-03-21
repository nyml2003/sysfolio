import type { CSSProperties } from "react";

export function iconStyle(color: string): CSSProperties {
  return {
    color,
    flexShrink: 0,
  };
}

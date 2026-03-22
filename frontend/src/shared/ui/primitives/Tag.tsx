import type { ReactNode } from "react";

import { clsx } from "clsx";

type TagTone = "default" | "accent" | "success" | "warning" | "danger";

type TagProps = {
  children: ReactNode;
  tone?: TagTone;
  className?: string;
};

export function Tag({ children, tone = "default", className }: TagProps) {
  return <span className={clsx("sf-tag", `sf-tag--${tone}`, className)}>{children}</span>;
}


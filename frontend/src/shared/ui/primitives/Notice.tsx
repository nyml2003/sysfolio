import type { ReactNode } from "react";

import { clsx } from "clsx";

type NoticeTone = "info" | "warning" | "danger" | "success";

type NoticeProps = {
  title: string;
  children: ReactNode;
  tone?: NoticeTone;
  className?: string;
};

export function Notice({
  title,
  children,
  tone = "info",
  className,
}: NoticeProps) {
  return (
    <div className={clsx("sf-notice", `sf-notice--${tone}`, className)}>
      <div className="sf-notice__title">{title}</div>
      <div className="sf-notice__body">{children}</div>
    </div>
  );
}


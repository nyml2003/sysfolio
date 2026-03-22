import type { ReactNode } from "react";

import { Button } from "@/shared/ui/primitives";
import { Stack, Surface } from "@/shared/ui/layout";

type ViewStateLayoutState = "ready" | "loading" | "empty" | "error";

type ViewStateLayoutProps = {
  state: ViewStateLayoutState;
  title?: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  children: ReactNode;
};

export function ViewStateLayout({
  state,
  title,
  body,
  actionLabel,
  onAction,
  children,
}: ViewStateLayoutProps) {
  if (state === "ready") {
    return <>{children}</>;
  }

  return (
    <Surface className="sf-view-state" tone={state === "error" ? "danger" : "muted"}>
      <Stack gap="sm">
        {title === undefined ? null : <h2 className="sf-view-state__title">{title}</h2>}
        {body === undefined ? null : <p className="sf-view-state__body">{body}</p>}
        {actionLabel === undefined || onAction === undefined ? null : (
          <Button onClick={onAction} tone="secondary">
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Surface>
  );
}


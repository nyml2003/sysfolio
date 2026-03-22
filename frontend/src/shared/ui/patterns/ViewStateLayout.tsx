import type { ReactNode } from "react";

import { isSome, none, type Option } from "@/shared/lib/monads/option";
import { ButtonSecondaryMd } from "@/shared/ui/primitives";
import { Stack, Surface } from "@/shared/ui/layout";

type ViewStateLayoutState = "ready" | "loading" | "empty" | "error";

type ViewStateLayoutProps = {
  state: ViewStateLayoutState;
  title: Option<string>;
  body: Option<string>;
  actionLabel: Option<string>;
  onAction: Option<() => void>;
  children: ReactNode;
};

export function ViewStateLayout({
  state,
  title = none(),
  body = none(),
  actionLabel = none(),
  onAction = none(),
  children,
}: ViewStateLayoutProps) {
  if (state === "ready") {
    return <>{children}</>;
  }

  return (
    <Surface className="sf-view-state" tone={state === "error" ? "danger" : "muted"}>
      <Stack gap="sm">
        {isSome(title) ? <h2 className="sf-view-state__title">{title.value}</h2> : null}
        {isSome(body) ? <p className="sf-view-state__body">{body.value}</p> : null}
        {isSome(actionLabel) && isSome(onAction) ? (
          <ButtonSecondaryMd onClick={onAction.value}>{actionLabel.value}</ButtonSecondaryMd>
        ) : null}
      </Stack>
    </Surface>
  );
}

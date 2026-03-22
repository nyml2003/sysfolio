import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { none, some } from "@/shared/lib/monads/option";

import { Button } from "./Button";

const tones = [
  "primary",
  "secondary",
  "ghost",
  "success",
  "warning",
  "destructive",
] as const;

const btn = {
  size: "md" as const,
  type: "button" as const,
  loading: false,
  leadingIcon: none(),
  trailingIcon: none(),
};

describe("Button", () => {
  it("applies sf-button and tone/size classes", () => {
    render(
      <Button {...btn} size="sm" tone="primary">
        Go
      </Button>,
    );
    const el = screen.getByRole("button", { name: "Go" });
    expect(el.className).toContain("sf-button");
    expect(el.className).toContain("sf-button--primary");
    expect(el.className).toContain("sf-button--sm");
  });

  it.each(tones)("tone %s maps to sf-button--%s", (tone) => {
    render(
      <Button {...btn} tone={tone}>
        label
      </Button>,
    );
    expect(screen.getByRole("button").className).toContain(`sf-button--${tone}`);
  });

  it("loading sets aria-busy, disabled, and loading class", () => {
    render(
      <Button {...btn} loading tone="secondary">
        Wait
      </Button>,
    );
    const el = screen.getByRole("button", { name: "Wait" });
    expect(el.getAttribute("aria-busy")).toBe("true");
    expect((el as HTMLButtonElement).disabled).toBe(true);
    expect(el.className).toContain("sf-button--loading");
  });

  it("renders leadingIcon in layout", () => {
    render(
      <Button {...btn} leadingIcon={some(<span data-testid="lead">icon</span>)} tone="secondary">
        Next
      </Button>,
    );
    expect(screen.getByTestId("lead")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Next" })).toBeTruthy();
  });
});

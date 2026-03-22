import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { none } from "@/shared/lib/monads/option";

import { ButtonGroup, ButtonGroupItem } from "./ButtonGroup";

const btn = {
  size: "md" as const,
  type: "button" as const,
  loading: false,
  fullWidth: false,
  truncateLabel: false,
  leadingIcon: none(),
  trailingIcon: none(),
};

describe("ButtonGroup", () => {
  it("exposes group role and label", () => {
    render(
      <ButtonGroup label="Alignment" variant="default">
        <ButtonGroupItem {...btn} tone="secondary">
          A
        </ButtonGroupItem>
      </ButtonGroup>,
    );
    expect(screen.getByRole("group", { name: "Alignment" })).toBeTruthy();
  });

  it("maps current to aria-pressed on items", () => {
    render(
      <ButtonGroup label="Mode" variant="attached">
        <ButtonGroupItem {...btn} current={false} tone="secondary">
          A
        </ButtonGroupItem>
        <ButtonGroupItem {...btn} current={true} tone="secondary">
          B
        </ButtonGroupItem>
      </ButtonGroup>,
    );
    expect(screen.getByRole("button", { name: "A" }).getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByRole("button", { name: "B" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("applies attached class and item classes", () => {
    render(
      <ButtonGroup label="G" variant="attached">
        <ButtonGroupItem {...btn} current tone="secondary">
          A
        </ButtonGroupItem>
      </ButtonGroup>,
    );
    const group = screen.getByRole("group");
    expect(group.className).toContain("sf-button-group--attached");
    expect(screen.getByRole("button").className).toContain("sf-button-group__item--current");
  });
});

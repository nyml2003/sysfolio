import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { none, some } from "@/shared/lib/monads/option";

import { Label } from "./Label";

const base = {
  requiredMark: none(),
  optionalMark: none(),
  infoAffordance: none(),
};

describe("Label", () => {
  it("renders label element when htmlFor is set", () => {
    const { container } = render(
      <Label {...base} htmlFor={some("field-id")} state="default" variant="default">
        Name
      </Label>,
    );
    const el = container.querySelector("label[for=field-id]");
    expect(el).toBeTruthy();
    expect(el?.textContent).toContain("Name");
  });

  it("renders span when no htmlFor", () => {
    const { container } = render(
      <Label {...base} htmlFor={none()} state="default" variant="default">
        Standalone
      </Label>,
    );
    expect(container.querySelector("span.sf-label")).toBeTruthy();
  });

  it("shows default required asterisk", () => {
    render(
      <Label {...base} htmlFor={none()} state="required" variant="default">
        Email
      </Label>,
    );
    expect(screen.getByText("*")).toBeTruthy();
  });

  it("shows optional mark when provided", () => {
    render(
      <Label {...base} htmlFor={none()} optionalMark={some("(opt)")} state="optional" variant="default">
        Note
      </Label>,
    );
    expect(screen.getByText("(opt)")).toBeTruthy();
  });
});

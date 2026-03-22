import { none, some } from "@/shared/lib/monads/option";
import { Inline, Stack } from "@/shared/ui/layout";
import type { ButtonOwnProps } from "@/shared/ui/primitives";
import { Button, Tag } from "@/shared/ui/primitives";
import { MoonIcon } from "@/shared/ui/primitives/Icon";

import { useOverviewCopy } from "../../overview-copy";
import { DemoBulletList } from "../overview-demo-frame";

const btnBase: Pick<ButtonOwnProps, "size" | "type" | "loading" | "leadingIcon" | "trailingIcon"> = {
  size: "md",
  type: "button",
  loading: false,
  leadingIcon: none(),
  trailingIcon: none(),
};

export function ButtonDemo() {
  const copy = useOverviewCopy();

  return (
    <Stack gap="xl">
      <Stack className="overview-demo__subsection" gap="sm">
        <div className="overview-eyebrow">{copy.demos.buttonIntroHeading}</div>
        <DemoBulletList items={copy.demos.buttonIntroBullets} />
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <div className="overview-eyebrow">{copy.demos.buttonToneHeading}</div>
        <DemoBulletList items={copy.demos.buttonToneBullets} />
        <Inline wrap>
          <Button {...btnBase} tone="primary">
            {copy.demos.buttonPrimary}
          </Button>
          <Button {...btnBase} tone="secondary">
            {copy.demos.buttonSecondary}
          </Button>
          <Button {...btnBase} tone="ghost">
            {copy.demos.buttonGhost}
          </Button>
        </Inline>
        <Inline wrap>
          <Button {...btnBase} tone="success">
            {copy.demos.buttonSuccess}
          </Button>
          <Button {...btnBase} tone="warning">
            {copy.demos.buttonWarning}
          </Button>
          <Button {...btnBase} tone="destructive">
            {copy.demos.buttonDestructive}
          </Button>
        </Inline>
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <div className="overview-eyebrow">{copy.demos.buttonSizeHeading}</div>
        <DemoBulletList items={copy.demos.buttonSizeBullets} />
        <Inline align="center" gap="md" wrap>
          <Button {...btnBase} tone="secondary">
            {copy.demos.buttonShowcaseMd}
          </Button>
          <Button {...btnBase} size="sm" tone="secondary">
            {copy.demos.buttonShowcaseSm}
          </Button>
        </Inline>
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <div className="overview-eyebrow">{copy.demos.buttonA11yHeading}</div>
        <DemoBulletList items={copy.demos.buttonA11yBullets} />
        <Inline align="center" gap="sm">
          <Button
            {...btnBase}
            aria-label={copy.demos.buttonIconAriaLabel}
            size="sm"
            tone="ghost"
          >
            <MoonIcon size={16} />
          </Button>
          <Tag tone="accent">aria-label</Tag>
        </Inline>
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <div className="overview-eyebrow">{copy.demos.buttonDenseHeading}</div>
        <DemoBulletList items={copy.demos.buttonDenseBullets} />
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <div className="overview-eyebrow">{copy.demos.buttonLoadingHeading}</div>
        <DemoBulletList items={copy.demos.buttonLoadingBullets} />
        <Inline wrap>
          <Button {...btnBase} loading tone="primary">
            {copy.demos.buttonLoadingLabel}
          </Button>
          <Button {...btnBase} leadingIcon={some(<MoonIcon size={16} />)} tone="secondary">
            {copy.demos.buttonWithLeadingLabel}
          </Button>
        </Inline>
      </Stack>
    </Stack>
  );
}

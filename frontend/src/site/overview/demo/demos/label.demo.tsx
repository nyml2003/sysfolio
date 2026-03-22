import { none, some } from "@/shared/lib/monads/option";
import { Inline, Stack } from "@/shared/ui/layout";
import type { LabelOwnProps } from "@/shared/ui/primitives";
import { Heading, IconButtonGhostSm, Label } from "@/shared/ui/primitives";
import { MoonIcon } from "@/shared/ui/primitives/Icon";

import { useOverviewCopy } from "../../overview-copy";
import { overviewDemoSectionHeadingBase } from "../demo-section-heading";
import { DemoBulletList } from "../overview-demo-frame";

const labelBase: Pick<
  LabelOwnProps,
  "htmlFor" | "requiredMark" | "optionalMark" | "infoAffordance"
> = {
  htmlFor: none(),
  requiredMark: none(),
  optionalMark: none(),
  infoAffordance: none(),
};

export function LabelDemo() {
  const copy = useOverviewCopy();

  return (
    <Stack gap="xl">
      <Stack className="overview-demo__subsection" gap="sm">
        <Heading {...overviewDemoSectionHeadingBase} level={2} tone="default" variant="caption-heading">
          {copy.demos.labelIntroHeading}
        </Heading>
        <DemoBulletList items={copy.demos.labelIntroBullets} />
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <Heading {...overviewDemoSectionHeadingBase} level={2} tone="default" variant="caption-heading">
          {copy.demos.labelVariantHeading}
        </Heading>
        <DemoBulletList items={copy.demos.labelVariantBullets} />
        <Inline gap="lg" wrap>
          <Label {...labelBase} state="default" variant="default">
            {copy.demos.labelSampleDefault}
          </Label>
          <Label {...labelBase} state="default" variant="strong">
            {copy.demos.labelSampleStrong}
          </Label>
          <Label {...labelBase} state="default" variant="subtle">
            {copy.demos.labelSampleSubtle}
          </Label>
        </Inline>
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <Heading {...overviewDemoSectionHeadingBase} level={2} tone="default" variant="caption-heading">
          {copy.demos.labelStateHeading}
        </Heading>
        <DemoBulletList items={copy.demos.labelStateBullets} />
        <Inline gap="lg" wrap>
          <Label {...labelBase} state="default" variant="default">
            {copy.demos.labelStateDefault}
          </Label>
          <Label {...labelBase} state="disabled" variant="default">
            {copy.demos.labelStateDisabled}
          </Label>
          <Label {...labelBase} state="required" variant="default">
            {copy.demos.labelStateRequired}
          </Label>
          <Label
            {...labelBase}
            optionalMark={some(copy.demos.labelOptionalMarkText)}
            state="optional"
            variant="default"
          >
            {copy.demos.labelStateOptional}
          </Label>
        </Inline>
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <Heading {...overviewDemoSectionHeadingBase} level={2} tone="default" variant="caption-heading">
          {copy.demos.labelAffordanceHeading}
        </Heading>
        <DemoBulletList items={copy.demos.labelAffordanceBullets} />
        <Label
          {...labelBase}
          infoAffordance={some(
            <IconButtonGhostSm
              loading={false}
              srLabel={copy.demos.labelInfoIconSrLabel}
              type="button"
            >
              <MoonIcon size={14} />
            </IconButtonGhostSm>,
          )}
          state="default"
          variant="default"
        >
          {copy.demos.labelWithInfoSlot}
        </Label>
      </Stack>
    </Stack>
  );
}

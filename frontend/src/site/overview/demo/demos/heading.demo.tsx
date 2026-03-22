import { some } from "@/shared/lib/monads/option";
import { Inline, Stack } from "@/shared/ui/layout";
import { Heading, Tag } from "@/shared/ui/primitives";
import { MoonIcon } from "@/shared/ui/primitives/Icon";

import { useOverviewCopy } from "../../overview-copy";
import { overviewDemoSectionHeadingBase } from "../demo-section-heading";
import { DemoBulletList } from "../overview-demo-frame";

export function HeadingDemo() {
  const copy = useOverviewCopy();

  return (
    <Stack gap="xl">
      <Stack className="overview-demo__subsection" gap="sm">
        <Heading {...overviewDemoSectionHeadingBase} level={2} tone="default" variant="caption-heading">
          {copy.demos.headingIntroHeading}
        </Heading>
        <DemoBulletList items={copy.demos.headingIntroBullets} />
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <Heading {...overviewDemoSectionHeadingBase} level={2} tone="default" variant="caption-heading">
          {copy.demos.headingVariantHeading}
        </Heading>
        <DemoBulletList items={copy.demos.headingVariantBullets} />
        <Stack gap="md">
          <Heading {...overviewDemoSectionHeadingBase} level={1} tone="default" variant="display">
            {copy.demos.headingSampleDisplay}
          </Heading>
          <Heading {...overviewDemoSectionHeadingBase} level={2} tone="default" variant="section">
            {copy.demos.headingSampleSection}
          </Heading>
          <Heading {...overviewDemoSectionHeadingBase} level={3} tone="default" variant="subsection">
            {copy.demos.headingSampleSubsection}
          </Heading>
          <Heading {...overviewDemoSectionHeadingBase} level={4} tone="default" variant="caption-heading">
            {copy.demos.headingSampleCaption}
          </Heading>
        </Stack>
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <Heading {...overviewDemoSectionHeadingBase} level={2} tone="default" variant="caption-heading">
          {copy.demos.headingToneHeading}
        </Heading>
        <DemoBulletList items={copy.demos.headingToneBullets} />
        <Inline gap="md" wrap>
          <Heading {...overviewDemoSectionHeadingBase} level={3} tone="default" variant="subsection">
            {copy.demos.headingToneDefault}
          </Heading>
          <Heading {...overviewDemoSectionHeadingBase} level={3} tone="muted" variant="subsection">
            {copy.demos.headingToneMuted}
          </Heading>
          <Heading {...overviewDemoSectionHeadingBase} level={3} tone="current" variant="subsection">
            {copy.demos.headingToneCurrent}
          </Heading>
        </Inline>
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <Heading {...overviewDemoSectionHeadingBase} level={2} tone="default" variant="caption-heading">
          {copy.demos.headingSlotsHeading}
        </Heading>
        <DemoBulletList items={copy.demos.headingSlotsBullets} />
        <Heading
          {...overviewDemoSectionHeadingBase}
          leadingIcon={some(<MoonIcon size={18} />)}
          level={3}
          tone="default"
          trailingMeta={some(<Tag tone="accent">{copy.demos.headingTrailingTag}</Tag>)}
          variant="section"
        >
          {copy.demos.headingSlotTitle}
        </Heading>
      </Stack>
    </Stack>
  );
}

import { Inline, Stack } from '@/shared/ui/layout';

import { Heading, Text } from '@/shared/ui/primitives';

import { useOverviewCopy } from '../../overview-copy';

import { overviewDemoSectionHeadingBase } from '../demo-section-heading';

import { DemoBulletList } from '../overview-demo-frame';

export function TextDemo() {
  const copy = useOverviewCopy();

  return (
    <Stack gap="xl">
      <Stack className="overview-demo__subsection" gap="sm">
        <Heading
          {...overviewDemoSectionHeadingBase}
          level={2}
          tone="default"
          variant="caption-heading"
        >
          {copy.demos.textIntroHeading}
        </Heading>

        <DemoBulletList items={copy.demos.textIntroBullets} />
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <Heading
          {...overviewDemoSectionHeadingBase}
          level={2}
          tone="default"
          variant="caption-heading"
        >
          {copy.demos.textVariantHeading}
        </Heading>

        <DemoBulletList items={copy.demos.textVariantBullets} />

        <Stack gap="md">
          <Text tone="default" variant="ui">
            {copy.demos.textSampleUi}
          </Text>

          <Text tone="default" variant="body">
            {copy.demos.textSampleBody}
          </Text>

          <Text tone="default" variant="strong">
            {copy.demos.textSampleStrong}
          </Text>

          <Text tone="default" variant="subtle">
            {copy.demos.textSampleSubtle}
          </Text>

          <Text tone="default" variant="caption">
            {copy.demos.textSampleCaption}
          </Text>

          <Text tone="default" variant="mono">
            {copy.demos.textSampleMono}
          </Text>
        </Stack>
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <Heading
          {...overviewDemoSectionHeadingBase}
          level={2}
          tone="default"
          variant="caption-heading"
        >
          {copy.demos.textToneHeading}
        </Heading>

        <DemoBulletList items={copy.demos.textToneBullets} />

        <Inline gap="md" wrap>
          <Text tone="default" variant="ui">
            {copy.demos.textToneDefault}
          </Text>

          <Text tone="muted" variant="ui">
            {copy.demos.textToneMuted}
          </Text>

          <Text tone="success" variant="ui">
            {copy.demos.textToneSuccess}
          </Text>

          <Text tone="warning" variant="ui">
            {copy.demos.textToneWarning}
          </Text>

          <Text tone="destructive" variant="ui">
            {copy.demos.textToneDestructive}
          </Text>

          <Text tone="disabled" variant="ui">
            {copy.demos.textToneDisabled}
          </Text>
        </Inline>
      </Stack>
    </Stack>
  );
}

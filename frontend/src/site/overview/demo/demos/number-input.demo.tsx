import { useState } from 'react';

import { none, some } from '@/shared/lib/monads/option';
import { Inline, Stack } from '@/shared/ui/layout';
import type { NumberInputOwnProps } from '@/shared/ui/primitives';
import { Heading, NumberInput } from '@/shared/ui/primitives';

import { useOverviewCopy } from '../../overview-copy';
import { overviewDemoSectionHeadingBase } from '../demo-section-heading';
import { DemoBulletList } from '../overview-demo-frame';

const emptySlots: Pick<NumberInputOwnProps, 'stepDown' | 'stepUp' | 'prefixSlot' | 'suffixSlot'> = {
  stepDown: none(),
  stepUp: none(),
  prefixSlot: none(),
  suffixSlot: none(),
};

export function NumberInputDemo() {
  const copy = useOverviewCopy();
  const [width, setWidth] = useState(12);

  return (
    <Stack gap="xl">
      <Stack className="overview-demo__subsection" gap="sm">
        <Heading
          {...overviewDemoSectionHeadingBase}
          level={2}
          tone="default"
          variant="caption-heading"
        >
          {copy.demos.numberInputIntroHeading}
        </Heading>
        <DemoBulletList items={copy.demos.numberInputIntroBullets} />
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <Heading
          {...overviewDemoSectionHeadingBase}
          level={2}
          tone="default"
          variant="caption-heading"
        >
          {copy.demos.numberInputVariantHeading}
        </Heading>
        <DemoBulletList items={copy.demos.numberInputVariantBullets} />
        <Inline gap="md" wrap>
          <NumberInput {...emptySlots} defaultValue={0} max={10} min={0} variant="default" />
          <NumberInput {...emptySlots} defaultValue={1} max={10} min={0} variant="invalid" />
          <NumberInput {...emptySlots} defaultValue={2} max={10} min={0} variant="warning" />
          <NumberInput {...emptySlots} defaultValue={3} max={10} min={0} variant="success" />
        </Inline>
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <Heading
          {...overviewDemoSectionHeadingBase}
          level={2}
          tone="default"
          variant="caption-heading"
        >
          {copy.demos.numberInputSlotsHeading}
        </Heading>
        <DemoBulletList items={copy.demos.numberInputSlotsBullets} />
        <NumberInput
          {...emptySlots}
          decrementAriaLabel={copy.demos.numberInputDecrementLabel}
          incrementAriaLabel={copy.demos.numberInputIncrementLabel}
          max={999}
          min={1}
          prefixSlot={some(copy.demos.numberInputPrefixLabel)}
          step={1}
          suffixSlot={some(copy.demos.numberInputSuffixLabel)}
          value={width}
          variant="default"
          onChange={(e) => setWidth(Number(e.target.value))}
        />
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <Heading
          {...overviewDemoSectionHeadingBase}
          level={2}
          tone="default"
          variant="caption-heading"
        >
          {copy.demos.numberInputLoadingHeading}
        </Heading>
        <NumberInput
          {...emptySlots}
          aria-label={copy.demos.numberInputLoadingHeading}
          defaultValue={4}
          loading
          variant="default"
        />
      </Stack>
    </Stack>
  );
}

import { useState } from 'react';

import { none, some } from '@/shared/lib/monads/option';
import { Inline, Stack } from '@/shared/ui/layout';
import type { SearchInputOwnProps } from '@/shared/ui/primitives';
import { ButtonGhostSm, Heading, SearchInput } from '@/shared/ui/primitives';

import { useOverviewCopy } from '../../overview-copy';
import { overviewDemoSectionHeadingBase } from '../demo-section-heading';
import { DemoBulletList } from '../overview-demo-frame';

const emptySlots: Pick<SearchInputOwnProps, 'leadingSearchIcon' | 'clear' | 'submit' | 'scope'> = {
  leadingSearchIcon: none(),
  clear: none(),
  submit: none(),
  scope: none(),
};

export function SearchInputDemo() {
  const copy = useOverviewCopy();
  const [query, setQuery] = useState('');

  return (
    <Stack gap="xl">
      <Stack className="overview-demo__subsection" gap="sm">
        <Heading
          {...overviewDemoSectionHeadingBase}
          level={2}
          tone="default"
          variant="caption-heading"
        >
          {copy.demos.searchInputIntroHeading}
        </Heading>
        <DemoBulletList items={copy.demos.searchInputIntroBullets} />
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <Heading
          {...overviewDemoSectionHeadingBase}
          level={2}
          tone="default"
          variant="caption-heading"
        >
          {copy.demos.searchInputVariantHeading}
        </Heading>
        <DemoBulletList items={copy.demos.searchInputVariantBullets} />
        <Inline gap="lg" wrap>
          <SearchInput
            {...emptySlots}
            placeholder={copy.demos.searchInputPlaceholder}
            variant="default"
          />
          <SearchInput
            {...emptySlots}
            placeholder={copy.demos.searchInputPlaceholder}
            variant="subtle"
          />
        </Inline>
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <Heading
          {...overviewDemoSectionHeadingBase}
          level={2}
          tone="default"
          variant="caption-heading"
        >
          {copy.demos.searchInputLoadingHeading}
        </Heading>
        <SearchInput
          {...emptySlots}
          aria-label={copy.demos.searchInputLoadingLabel}
          loading
          placeholder={copy.demos.searchInputPlaceholder}
          variant="default"
        />
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <Heading
          {...overviewDemoSectionHeadingBase}
          level={2}
          tone="default"
          variant="caption-heading"
        >
          {copy.demos.searchInputSlotsHeading}
        </Heading>
        <DemoBulletList items={copy.demos.searchInputSlotsBullets} />
        <SearchInput
          clear={some(
            <ButtonGhostSm type="button" onClick={() => setQuery('')}>
              ×
            </ButtonGhostSm>
          )}
          leadingSearchIcon={none()}
          placeholder={copy.demos.searchInputPlaceholder}
          scope={some(<span>{copy.demos.searchInputScopeLabel}</span>)}
          submit={some(
            <ButtonGhostSm type="button">{copy.demos.searchInputSubmitLabel}</ButtonGhostSm>
          )}
          value={query}
          variant="default"
          onChange={(e) => setQuery(e.target.value)}
        />
      </Stack>
    </Stack>
  );
}

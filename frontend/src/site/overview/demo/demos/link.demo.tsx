import { none } from '@/shared/lib/monads/option';

import { Inline, Stack } from '@/shared/ui/layout';

import type { LinkOwnProps } from '@/shared/ui/primitives';

import { Heading, Link } from '@/shared/ui/primitives';

import { useOverviewCopy } from '../../overview-copy';

import { overviewDemoSectionHeadingBase } from '../demo-section-heading';

import { DemoBulletList } from '../overview-demo-frame';

const linkBase: Pick<LinkOwnProps, 'leadingIcon' | 'trailingIcon'> = {
  leadingIcon: none(),

  trailingIcon: none(),
};

export function LinkDemo() {
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
          {copy.demos.linkIntroHeading}
        </Heading>

        <DemoBulletList items={copy.demos.linkIntroBullets} />
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <Heading
          {...overviewDemoSectionHeadingBase}
          level={2}
          tone="default"
          variant="caption-heading"
        >
          {copy.demos.linkVariantHeading}
        </Heading>

        <DemoBulletList items={copy.demos.linkVariantBullets} />

        <Inline gap="lg" wrap>
          <Link {...linkBase} href="#link-variants" variant="default">
            {copy.demos.linkSampleDefault}
          </Link>

          <Link {...linkBase} href="#link-variants" variant="subtle">
            {copy.demos.linkSampleSubtle}
          </Link>

          <Link
            {...linkBase}
            href="https://example.com"
            rel="noopener noreferrer"
            target="_blank"
            variant="external"
          >
            {copy.demos.linkSampleExternal}
          </Link>
        </Inline>
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <Heading
          {...overviewDemoSectionHeadingBase}
          level={2}
          tone="default"
          variant="caption-heading"
        >
          {copy.demos.linkNavHeading}
        </Heading>

        <DemoBulletList items={copy.demos.linkNavBullets} />

        <Inline gap="lg" wrap>
          <Link {...linkBase} current href="#link-current" variant="default">
            {copy.demos.linkNavCurrent}
          </Link>

          <Link {...linkBase} href="#link-other" variant="default">
            {copy.demos.linkNavOther}
          </Link>
        </Inline>
      </Stack>
    </Stack>
  );
}

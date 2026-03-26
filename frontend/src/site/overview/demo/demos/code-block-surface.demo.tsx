import { none, some } from '@/shared/lib/monads/option';

import { Stack } from '@/shared/ui/layout';

import type { CodeBlockSurfaceOwnProps } from '@/shared/ui/primitives';

import { ButtonGhostSm, CodeBlockSurface, Heading, Text } from '@/shared/ui/primitives';

import { useOverviewCopy } from '../../overview-copy';

import { overviewDemoSectionHeadingBase } from '../demo-section-heading';

import { DemoBulletList } from '../overview-demo-frame';

const emptySlots: Pick<
  CodeBlockSurfaceOwnProps,
  'header' | 'language' | 'meta' | 'actions' | 'footer'
> = {
  header: none(),

  language: none(),

  meta: none(),

  actions: none(),

  footer: none(),
};

export function CodeBlockSurfaceDemo() {
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
          {copy.demos.codeBlockSurfaceIntroHeading}
        </Heading>

        <DemoBulletList items={copy.demos.codeBlockSurfaceIntroBullets} />
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <Heading
          {...overviewDemoSectionHeadingBase}
          level={2}
          tone="default"
          variant="caption-heading"
        >
          {copy.demos.codeBlockSurfaceVariantHeading}
        </Heading>

        <DemoBulletList items={copy.demos.codeBlockSurfaceVariantBullets} />

        <Stack gap="md">
          <CodeBlockSurface
            {...emptySlots}
            code={copy.demos.codeBlockSurfaceSnippetTsx}
            language={some('tsx')}
            scrollable
            variant="default"
          />

          <CodeBlockSurface
            {...emptySlots}
            code={copy.demos.codeBlockSurfaceSnippetCommand}
            language={some('sh')}
            scrollable
            variant="command"
          />

          <CodeBlockSurface
            {...emptySlots}
            code={copy.demos.codeBlockSurfaceSnippetDiff}
            language={some('diff')}
            scrollable
            variant="diff-neutral"
          />
        </Stack>
      </Stack>

      <Stack className="overview-demo__subsection" gap="sm">
        <Heading
          {...overviewDemoSectionHeadingBase}
          level={2}
          tone="default"
          variant="caption-heading"
        >
          {copy.demos.codeBlockSurfaceLayoutHeading}
        </Heading>

        <DemoBulletList items={copy.demos.codeBlockSurfaceLayoutBullets} />

        <CodeBlockSurface
          actions={some(
            <ButtonGhostSm loading={false} type="button">
              {copy.demos.codeBlockSurfaceCopyAction}
            </ButtonGhostSm>
          )}
          code={copy.demos.codeBlockSurfaceSnippetTsx}
          footer={some(
            <Text tone="muted" variant="caption">
              {copy.demos.codeBlockSurfaceFooterNote}
            </Text>
          )}
          header={none()}
          language={some('tsx')}
          meta={some(copy.demos.codeBlockSurfaceMetaReadOnly)}
          scrollable
          variant="default"
        />
      </Stack>
    </Stack>
  );
}

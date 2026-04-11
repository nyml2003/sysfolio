import type {
  ContentNode,
  ContextInfo,
  DirectoryChildSummary,
  RenderableArtifact,
  RepositoryError,
} from '@/entities/content';
import { isSome, none } from '@/shared/lib/monads/option';
import type { Option } from '@/shared/lib/monads/option';
import type { ResourceState } from '@/shared/lib/resource/resource-state';
import { useUiCopy } from '@/shared/lib/i18n/use-ui-copy';
import { Stack, Surface } from '@/shared/ui/layout';
import { ButtonGhostMd, ButtonSecondaryMd, Heading, Tag, Text } from '@/shared/ui/primitives';

type ContextPanelProps = {
  artifactResource: ResourceState<
    { artifact: RenderableArtifact; node: ContentNode },
    RepositoryError
  >;
  contextResource: ResourceState<ContextInfo, RepositoryError>;
  activeHeadingId: string;
  onNavigate: (path: string) => void;
  onScrollToHeading: (headingId: string) => void;
};

function renderParentSection(
  parent: Option<DirectoryChildSummary>,
  title: string,
  backToLabel: (entryTitle: string) => string,
  onNavigate: (path: string) => void
) {
  if (!isSome(parent)) {
    return null;
  }

  return (
    <Stack as="section" gap="sm">
      <Heading
        level={4}
        leadingIcon={none()}
        tone="muted"
        trailingMeta={none()}
        variant="caption-heading"
      >
        {title}
      </Heading>
      <ButtonSecondaryMd
        onClick={() => {
          onNavigate(parent.value.path);
        }}
      >
        {backToLabel(parent.value.title)}
      </ButtonSecondaryMd>
    </Stack>
  );
}

export function ContextPanel({
  artifactResource,
  contextResource,
  activeHeadingId,
  onNavigate,
  onScrollToHeading,
}: ContextPanelProps) {
  const copy = useUiCopy();

  if (artifactResource.tag !== 'ready' && contextResource.tag !== 'ready') {
    return (
      <Stack as="aside" className="sf-context-panel" gap="md">
        <Surface tone="muted">
          <Stack as="section" gap="sm">
            <Heading
              level={4}
              leadingIcon={none()}
              tone="muted"
              trailingMeta={none()}
              variant="caption-heading"
            >
              {copy.contextPanel.placeholderTitle}
            </Heading>
            <Text tone="muted" variant="subtle">
              {copy.contextPanel.placeholderBody}
            </Text>
          </Stack>
        </Surface>
      </Stack>
    );
  }

  const context =
    contextResource.tag === 'ready'
      ? contextResource.value
      : {
          breadcrumbs: [],
          parent: none(),
          siblings: [],
          recentEntries: [],
          stats: none(),
        };
  const parentSection = renderParentSection(
    context.parent,
    copy.contextPanel.parentTitle,
    copy.contextPanel.backTo,
    onNavigate
  );

  return (
    <Stack as="aside" className="sf-context-panel" gap="md">
      {artifactResource.tag === 'ready' && artifactResource.value.artifact.kind === 'article' ? (
        <Surface>
          <Stack as="section" gap="sm">
            <Heading
              level={4}
              leadingIcon={none()}
              tone="muted"
              trailingMeta={none()}
              variant="caption-heading"
            >
              {copy.contextPanel.tocTitle}
            </Heading>
            {artifactResource.value.artifact.toc.map((item) => (
              <ButtonGhostMd
                aria-current={item.id === activeHeadingId ? 'location' : false}
                className={[
                  'sf-context-panel__toc-item',
                  item.id === activeHeadingId ? 'is-active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={item.id}
                onClick={() => {
                  onScrollToHeading(item.id);
                }}
              >
                {item.title}
              </ButtonGhostMd>
            ))}
          </Stack>
        </Surface>
      ) : null}

      {isSome(context.stats) ? (
        <Surface>
          <Stack as="section" gap="sm">
            <Heading
              level={4}
              leadingIcon={none()}
              tone="muted"
              trailingMeta={none()}
              variant="caption-heading"
            >
              {copy.contextPanel.directoryStatsTitle}
            </Heading>
            <Tag>{copy.common.itemCount(context.stats.value.childCount)}</Tag>
            <Tag>{copy.common.folderCount(context.stats.value.folderCount)}</Tag>
            <Tag>{copy.common.articleCount(context.stats.value.articleCount)}</Tag>
          </Stack>
        </Surface>
      ) : null}

      {parentSection}

      {context.recentEntries.length > 0 ? (
        <Surface>
          <Stack as="section" gap="sm">
            <Heading
              level={4}
              leadingIcon={none()}
              tone="muted"
              trailingMeta={none()}
              variant="caption-heading"
            >
              {copy.contextPanel.recentTitle}
            </Heading>
            {context.recentEntries.map((entry) => (
              <ButtonGhostMd
                className="sf-context-panel__toc-item"
                key={entry.id}
                onClick={() => {
                  onNavigate(entry.path);
                }}
              >
                {entry.title}
              </ButtonGhostMd>
            ))}
          </Stack>
        </Surface>
      ) : null}
    </Stack>
  );
}

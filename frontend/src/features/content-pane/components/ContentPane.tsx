import type { ContextInfo, RenderableEntryPayload, RepositoryError } from '@/entities/content';
import { ArticleView } from '@/features/article/components/ArticleView';
import { HomeView } from '@/features/home/components/HomeView';
import { useUiCopy } from '@/shared/lib/i18n/use-ui-copy';
import { isSome, none, unwrapOr } from '@/shared/lib/monads/option';
import { ROOT_PATH } from '@/shared/lib/path/content-path';
import type { ResourceState } from '@/shared/lib/resource/resource-state';
import { Inline, Stack, Surface } from '@/shared/ui/layout';
import { ArticleIcon, FolderIcon, GameIcon, MediaIcon } from '@/shared/ui/primitives/Icon';
import { ButtonGhostMd, ButtonSecondaryMd, Heading, Tag, Text } from '@/shared/ui/primitives';

type ContentPaneProps = {
  resource: ResourceState<RenderableEntryPayload, RepositoryError>;
  onNavigate: (path: string) => void;
  restoreNoticeVisible: boolean;
  scrollToTop: () => void;
};

function renderDirectoryIcon(kind: string) {
  if (kind === 'folder') {
    return <FolderIcon size={16} />;
  }

  if (kind === 'game') {
    return <GameIcon size={16} />;
  }

  if (kind === 'media') {
    return <MediaIcon size={16} />;
  }

  return <ArticleIcon size={16} />;
}

function renderDirectoryView(
  payload: RenderableEntryPayload,
  onNavigate: (path: string) => void,
  copy: ReturnType<typeof useUiCopy>
) {
  if (payload.content.kind !== 'directory') {
    return null;
  }

  return (
    <Stack className="sf-content-pane-directory" gap="lg">
      <Stack as="header" gap="sm">
        <Text tone="muted" variant="caption">
          {payload.node.pathSegments.join(' / ') || copy.common.rootLabel}
        </Text>
        <Heading
          level={1}
          leadingIcon={none()}
          tone="default"
          trailingMeta={none()}
          variant="display"
        >
          {payload.content.title}
        </Heading>
        {unwrapOr(payload.content.description, '') === '' ? null : (
          <Text tone="muted" variant="body">
            {unwrapOr(payload.content.description, '')}
          </Text>
        )}
      </Stack>
      <Inline gap="sm" wrap>
        <Tag>{copy.common.itemCount(payload.content.children.length)}</Tag>
        <Tag>{copy.contentPane.directorySharedMeta}</Tag>
      </Inline>
      <Stack gap="sm">
        {payload.content.children.map((entry) => (
          <Surface key={entry.id}>
            <ButtonGhostMd
              className="sf-content-pane-directory__entry"
              onClick={() => {
                onNavigate(entry.path);
              }}
            >
              {renderDirectoryIcon(entry.kind)}
              <Stack className="sf-content-pane-directory__entry-body" gap="xs">
                <Heading
                  level={3}
                  leadingIcon={none()}
                  tone="default"
                  trailingMeta={none()}
                  variant="subsection"
                >
                  {entry.title}
                </Heading>
                <Inline gap="xs" wrap>
                  <Tag>{copy.common.kindLabel(entry.kind)}</Tag>
                  {isSome(entry.readingMinutes) ? (
                    <Tag>{copy.common.minuteCount(entry.readingMinutes.value)}</Tag>
                  ) : null}
                </Inline>
                {unwrapOr(entry.description, '') === '' ? null : (
                  <Text tone="muted" variant="subtle">
                    {unwrapOr(entry.description, '')}
                  </Text>
                )}
              </Stack>
            </ButtonGhostMd>
          </Surface>
        ))}
      </Stack>
    </Stack>
  );
}

function renderUnsupportedState(
  context: ContextInfo,
  onNavigate: (path: string) => void,
  copy: ReturnType<typeof useUiCopy>
) {
  const fallbackPath = isSome(context.parent)
    ? context.parent.value.path
    : context.breadcrumbs.length > 0
      ? context.breadcrumbs[0].path
      : ROOT_PATH;

  return (
    <Stack className="sf-content-pane-state" gap="md">
      <Surface>
        <Stack gap="md">
          <Heading
            level={2}
            leadingIcon={none()}
            tone="default"
            trailingMeta={none()}
            variant="section"
          >
            {copy.contentPane.unsupportedTitle}
          </Heading>
          <Text tone="muted" variant="body">
            {copy.contentPane.unsupportedBody}
          </Text>
          <ButtonSecondaryMd
            onClick={() => {
              onNavigate(fallbackPath);
            }}
          >
            {copy.contentPane.backToParent}
          </ButtonSecondaryMd>
        </Stack>
      </Surface>
    </Stack>
  );
}

function renderStatusState(title: string, message: string) {
  return (
    <Stack className="sf-content-pane-state" gap="md">
      <Surface>
        <Stack gap="md">
          <Heading
            level={2}
            leadingIcon={none()}
            tone="default"
            trailingMeta={none()}
            variant="section"
          >
            {title}
          </Heading>
          <Text tone="muted" variant="body">
            {message}
          </Text>
        </Stack>
      </Surface>
    </Stack>
  );
}

export function ContentPane({
  resource,
  onNavigate,
  restoreNoticeVisible,
  scrollToTop,
}: ContentPaneProps) {
  const copy = useUiCopy();

  if (resource.tag === 'loading' || resource.tag === 'idle') {
    return renderStatusState(copy.contentPane.loadingTitle, copy.contentPane.loadingBody);
  }

  if (resource.tag === 'error') {
    return renderStatusState(copy.contentPane.notFoundTitle, resource.error.message);
  }

  if (resource.tag === 'empty') {
    return renderStatusState(
      copy.contentPane.emptyTitle,
      unwrapOr(resource.reason, copy.contentPane.defaultEmptyReason)
    );
  }

  const context = unwrapOr(resource.value.context, {
    breadcrumbs: [],
    parent: none(),
    siblings: [],
    recentEntries: [],
    stats: none(),
  });

  if (resource.value.content.kind === 'home') {
    return <HomeView content={resource.value.content} context={context} onNavigate={onNavigate} />;
  }

  if (resource.value.content.kind === 'directory') {
    return renderDirectoryView(resource.value, onNavigate, copy);
  }

  if (resource.value.content.kind === 'article') {
    return (
      <ArticleView
        document={resource.value.content}
        node={resource.value.node}
        restoreNoticeVisible={restoreNoticeVisible}
        scrollToTop={scrollToTop}
      />
    );
  }

  return renderUnsupportedState(context, onNavigate, copy);
}

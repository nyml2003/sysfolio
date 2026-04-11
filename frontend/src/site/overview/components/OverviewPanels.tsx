import { startTransition, useCallback, useState } from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';

import type {
  BreadcrumbSegment,
  RenderableArtifactPayload,
  RepositoryError,
} from '@/entities/content';
import { useFileTree } from '@/features/file-tree/hooks/useFileTree';
import { getOverviewDocumentMeta } from '@/shared/data/mock/content.fixtures';
import { getThemeToggleAriaLabel } from '@/shared/lib/i18n/ui-copy';
import { useUiCopy } from '@/shared/lib/i18n/use-ui-copy';
import { fromNullable, isSome, none, type Option, unwrapOr } from '@/shared/lib/monads/option';
import { ROOT_PATH, pathFromSegments } from '@/shared/lib/path/content-path';
import type { ResourceState } from '@/shared/lib/resource/resource-state';
import { usePreferences } from '@/shared/store/preferences';
import { useStyleContext } from '@/shared/ui/foundation';
import { useOverviewCopy } from '@/site/overview/overview-copy';
import { Grid, Inline, Stack, Surface } from '@/shared/ui/layout';
import { ButtonGhostMd, ButtonGhostSm, SegmentedControl, Tag } from '@/shared/ui/primitives';
import { iconStyle } from '@/shared/ui/primitives/Icon.style';
import {
  ArticleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
  MoonIcon,
  SunIcon,
} from '@/shared/ui/primitives/Icon';

function getNodePath(pathSegments: string[], kind: string): string {
  return kind === 'home' ? ROOT_PATH : pathFromSegments(pathSegments);
}

function renderNodeIcon(kind: string) {
  if (kind === 'folder') {
    return <FolderIcon size={16} style={iconStyle('currentColor')} />;
  }

  return <ArticleIcon size={16} style={iconStyle('currentColor')} />;
}

function toStableElementOption(
  currentElement: Option<HTMLDivElement>,
  nextElement: HTMLDivElement | null
): Option<HTMLDivElement> {
  const nextOption = fromNullable(nextElement);

  if (!isSome(nextOption)) {
    return isSome(currentElement) ? none() : currentElement;
  }

  if (isSome(currentElement) && currentElement.value === nextOption.value) {
    return currentElement;
  }

  return nextOption;
}

type OverviewPathBarProps = {
  breadcrumbs: BreadcrumbSegment[];
  onNavigate: (path: string) => void;
  onOpenNavigation: () => void;
  onOpenContext: () => void;
};

export function OverviewPathBar({
  breadcrumbs,
  onNavigate,
  onOpenNavigation,
  onOpenContext,
}: OverviewPathBarProps) {
  const { density, layoutMode, motion, theme } = useStyleContext();
  const { locale, setDensity, toggleLocale, toggleTheme } = usePreferences();
  const copy = useOverviewCopy();
  const ui = useUiCopy();
  const isCompact = layoutMode === 'compact';
  const showContextToggle = layoutMode !== 'spacious';

  return (
    <header className="overview-topbar">
      <Inline align="between" className="overview-topbar__row" gap="md" wrap>
        <Inline className="overview-breadcrumbs" gap="xs" wrap>
          {isCompact ? (
            <ButtonGhostSm onClick={onOpenNavigation}>{copy.topBar.filesButton}</ButtonGhostSm>
          ) : null}
          {breadcrumbs.map((segment, index) => {
            const isCurrent = index === breadcrumbs.length - 1;

            return (
              <Inline className="overview-breadcrumbs__group" gap="xs" key={segment.id}>
                <ButtonGhostMd
                  aria-current={isCurrent ? 'page' : false}
                  className="overview-breadcrumbs__button"
                  disabled={isCurrent}
                  onClick={() => {
                    if (!isCurrent) {
                      onNavigate(segment.path);
                    }
                  }}
                >
                  {segment.title}
                </ButtonGhostMd>
                {isCurrent ? null : <span className="overview-breadcrumbs__separator">/</span>}
              </Inline>
            );
          })}
        </Inline>
        <Inline align="center" className="overview-topbar__tools" gap="sm" wrap>
          <Tag>{copy.runtime.layoutModeLabel(layoutMode)}</Tag>
          <Tag>{copy.runtime.motionLabel(motion)}</Tag>
          <SegmentedControl
            label={copy.topBar.densityLabel}
            onChange={setDensity}
            options={[
              { value: 'comfortable', label: 'C' },
              { value: 'medium', label: 'M' },
              { value: 'compact', label: 'X' },
            ]}
            value={density}
          />
          <ButtonGhostSm aria-label={getThemeToggleAriaLabel(locale, theme)} onClick={toggleTheme}>
            {theme === 'light' ? <MoonIcon size={16} /> : <SunIcon size={16} />}
          </ButtonGhostSm>
          <ButtonGhostSm aria-label={ui.localeToggle.ariaLabel} onClick={toggleLocale}>
            {ui.localeToggle.buttonLabel}
          </ButtonGhostSm>
          {showContextToggle ? (
            <ButtonGhostSm onClick={onOpenContext}>{copy.topBar.contextButton}</ButtonGhostSm>
          ) : null}
        </Inline>
      </Inline>
    </header>
  );
}

type OverviewFileTreeProps = {
  currentPath: string;
  onNavigate: (path: string) => void;
};

export function OverviewFileTree({ currentPath, onNavigate }: OverviewFileTreeProps) {
  const copy = useOverviewCopy();
  const [scrollElement, setScrollElement] = useState<Option<HTMLDivElement>>(none());
  const { rows, rootState, expandedIds, toggleNode } = useFileTree(currentPath);
  const registerScrollElement = useCallback((node: HTMLDivElement | null) => {
    setScrollElement((currentElement) => toStableElementOption(currentElement, node));
  }, []);
  const virtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 40,
    getScrollElement: () => (isSome(scrollElement) ? scrollElement.value : null),
    overscan: 10,
  });

  return (
    <Stack className="overview-rail" gap="sm">
      <div className="overview-rail__title">{copy.rail.fileTreeTitle}</div>
      {rootState.tag === 'error' ? (
        <Surface tone="danger">{rootState.error.message}</Surface>
      ) : null}
      <div className="overview-tree" ref={registerScrollElement}>
        <div
          className="overview-tree__viewport"
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            const nodePath = getNodePath(row.node.pathSegments, row.node.kind);
            const isFolder = row.node.kind === 'folder';
            const isExpanded = row.isExpanded || expandedIds.includes(row.node.id);
            const showDisclosure = isFolder && row.node.hasChildren;

            return (
              <div
                className={[
                  'overview-tree__row',
                  row.isSelected ? 'overview-tree__row--selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={row.node.id}
                style={{
                  paddingInlineStart: `calc(var(--sf-space-3) + ${row.depth} * var(--sf-space-4))`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <ButtonGhostMd
                  {...(showDisclosure ? { 'aria-expanded': isExpanded } : {})}
                  className="overview-tree__trigger"
                  disabled={!showDisclosure}
                  onClick={() => {
                    if (showDisclosure) {
                      toggleNode(row.node.id);
                    }
                  }}
                >
                  {showDisclosure ? (
                    isExpanded ? (
                      <ChevronDownIcon size={14} />
                    ) : (
                      <ChevronRightIcon size={14} />
                    )
                  ) : (
                    false
                  )}
                </ButtonGhostMd>
                {renderNodeIcon(row.node.kind)}
                <ButtonGhostMd
                  className="overview-tree__label"
                  onClick={() => {
                    startTransition(() => {
                      onNavigate(nodePath);
                    });
                  }}
                >
                  {row.node.title}
                </ButtonGhostMd>
              </div>
            );
          })}
        </div>
      </div>
    </Stack>
  );
}

type OverviewContextPanelProps = {
  artifactResource: ResourceState<RenderableArtifactPayload, RepositoryError>;
  activeHeadingId: string;
  onNavigate: (path: string) => void;
  onScrollToHeading: (headingId: string) => void;
};

export function OverviewContextPanel({
  artifactResource,
  activeHeadingId,
  onNavigate,
  onScrollToHeading,
}: OverviewContextPanelProps) {
  const style = useStyleContext();
  const copy = useOverviewCopy();

  if (artifactResource.tag !== 'ready') {
    return (
      <Stack className="overview-rail" gap="sm">
        <div className="overview-rail__title">{copy.context.panelTitle}</div>
        <Surface tone="muted">{copy.context.placeholderBody}</Surface>
      </Stack>
    );
  }

  const context = unwrapOr(artifactResource.value.context, {
    breadcrumbs: [],
    parent: none(),
    siblings: [],
    recentEntries: [],
    stats: none(),
  });
  const articleMeta =
    artifactResource.value.artifact.kind === 'article'
      ? getOverviewDocumentMeta(artifactResource.value.artifact.id)
      : none();
  const recentArtifacts = context.recentEntries;

  return (
    <Stack className="overview-rail" gap="sm">
      <div className="overview-rail__title">{copy.context.panelTitle}</div>
      <Surface>
        <Stack gap="sm">
          <div className="overview-section-title">{copy.context.runtimeTitle}</div>
          <Grid columns={2}>
            <Tag tone="accent">{copy.runtime.themeLabel(style.theme)}</Tag>
            <Tag>{copy.runtime.densityLabel(style.density)}</Tag>
            <Tag>{copy.runtime.layoutModeLabel(style.layoutMode)}</Tag>
            <Tag>{copy.runtime.motionLabel(style.motion)}</Tag>
          </Grid>
        </Stack>
      </Surface>
      {artifactResource.value.artifact.kind === 'article' ? (
        <Surface>
          <Stack gap="sm">
            <div className="overview-section-title">{copy.context.onThisPageTitle}</div>
            {artifactResource.value.artifact.toc.map((item) => (
              <ButtonGhostMd
                className={[
                  'overview-context-link',
                  item.id === activeHeadingId ? 'overview-context-link--active' : '',
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
      {isSome(articleMeta) ? (
        <Surface>
          <Stack gap="sm">
            <div className="overview-section-title">{copy.context.coverageTitle}</div>
            <Inline gap="xs" wrap>
              <Tag tone="accent">{copy.meta.layerLabel(articleMeta.value.layer)}</Tag>
              <Tag>{copy.meta.statusLabel(articleMeta.value.status)}</Tag>
              <Tag>{copy.meta.designStatusLabel(articleMeta.value.designStatus)}</Tag>
            </Inline>
            {articleMeta.value.gaps.length > 0 ? (
              <Stack gap="xs">
                {articleMeta.value.gaps.map((gap) => (
                  <div className="overview-copy" key={gap.id}>
                    {gap.title}
                  </div>
                ))}
              </Stack>
            ) : (
              <div className="overview-copy">{copy.context.noOpenDesignGaps}</div>
            )}
          </Stack>
        </Surface>
      ) : null}
      {recentArtifacts.length > 0 ? (
        <Surface>
          <Stack gap="sm">
            <div className="overview-section-title">{copy.context.recentArtifactsTitle}</div>
            {recentArtifacts.map((artifact) => (
              <ButtonGhostMd
                className="overview-context-link"
                key={artifact.id}
                onClick={() => {
                  onNavigate(artifact.path);
                }}
              >
                {artifact.title}
              </ButtonGhostMd>
            ))}
          </Stack>
        </Surface>
      ) : null}
    </Stack>
  );
}

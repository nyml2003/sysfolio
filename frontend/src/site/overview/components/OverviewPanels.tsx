import { startTransition, useCallback, useState } from "react";

import { useVirtualizer } from "@tanstack/react-virtual";

import type { BreadcrumbSegment, RenderableEntryPayload, RepositoryError } from "@/entities/content";
import { useFileTree } from "@/features/file-tree/hooks/useFileTree";
import { getOverviewDocumentMeta } from "@/shared/data/mock/content.fixtures";
import { fromNullable, isSome, none, type Option, unwrapOr } from "@/shared/lib/monads/option";
import { ROOT_PATH, pathFromSegments } from "@/shared/lib/path/content-path";
import type { ResourceState } from "@/shared/lib/resource/resource-state";
import { usePreferences } from "@/shared/store/preferences";
import { useStyleContext } from "@/shared/ui/foundation";
import { Grid, Inline, Stack, Surface } from "@/shared/ui/layout";
import { Button, SegmentedControl, Tag } from "@/shared/ui/primitives";
import { iconStyle } from "@/shared/ui/primitives/Icon.style";
import {
  ArticleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
  MoonIcon,
  SunIcon,
} from "@/shared/ui/primitives/Icon";

function getNodePath(pathSegments: string[], kind: string): string {
  return kind === "home" ? ROOT_PATH : pathFromSegments(pathSegments);
}

function renderNodeIcon(kind: string) {
  if (kind === "folder") {
    return <FolderIcon size={16} style={iconStyle("currentColor")} />;
  }

  return <ArticleIcon size={16} style={iconStyle("currentColor")} />;
}

function toStableElementOption(
  currentElement: Option<HTMLDivElement>,
  nextElement: HTMLDivElement | null,
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
  const isCompact = layoutMode === "compact";
  const showContextToggle = layoutMode !== "spacious";

  return (
    <header className="overview-topbar">
      <Inline align="between" className="overview-topbar__row" gap="md" wrap>
        <Inline className="overview-breadcrumbs" gap="xs" wrap>
          {isCompact ? (
            <Button onClick={onOpenNavigation} size="sm" tone="ghost">
              Files
            </Button>
          ) : null}
          {breadcrumbs.map((segment, index) => {
            const isCurrent = index === breadcrumbs.length - 1;

            return (
              <Inline className="overview-breadcrumbs__group" gap="xs" key={segment.id}>
                <button
                  aria-current={isCurrent ? "page" : false}
                  className="overview-breadcrumbs__button"
                  disabled={isCurrent}
                  onClick={() => {
                    if (!isCurrent) {
                      onNavigate(segment.path);
                    }
                  }}
                  type="button"
                >
                  {segment.title}
                </button>
                {isCurrent ? null : <span className="overview-breadcrumbs__separator">/</span>}
              </Inline>
            );
          })}
        </Inline>
        <Inline align="center" className="overview-topbar__tools" gap="sm" wrap>
          <Tag>{layoutMode}</Tag>
          <Tag>{motion}</Tag>
          <SegmentedControl
            label="Density"
            onChange={setDensity}
            options={[
              { value: "comfortable", label: "C" },
              { value: "medium", label: "M" },
              { value: "compact", label: "X" },
            ]}
            value={density}
          />
          <Button onClick={toggleTheme} size="sm" tone="ghost">
            {theme === "light" ? <MoonIcon size={16} /> : <SunIcon size={16} />}
          </Button>
          <Button onClick={toggleLocale} size="sm" tone="ghost">
            {locale === "en-US" ? "中" : "EN"}
          </Button>
          {showContextToggle ? (
            <Button onClick={onOpenContext} size="sm" tone="ghost">
              Context
            </Button>
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

export function OverviewFileTree({
  currentPath,
  onNavigate,
}: OverviewFileTreeProps) {
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
      <div className="overview-rail__title">Filesystem</div>
      {rootState.tag === "error" ? <Surface tone="danger">{rootState.error.message}</Surface> : null}
      <div className="overview-tree" ref={registerScrollElement}>
        <div className="overview-tree__viewport" style={{ height: `${virtualizer.getTotalSize()}px` }}>
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            const nodePath = getNodePath(row.node.pathSegments, row.node.kind);
            const isFolder = row.node.kind === "folder";
            const isExpanded = row.isExpanded || expandedIds.includes(row.node.id);
            const showDisclosure = isFolder && row.node.hasChildren;

            return (
              <div
                className={[
                  "overview-tree__row",
                  row.isSelected ? "overview-tree__row--selected" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={row.node.id}
                style={{
                  paddingInlineStart: `calc(var(--sf-space-3) + ${row.depth} * var(--sf-space-4))`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <button
                  aria-expanded={showDisclosure ? isExpanded : undefined}
                  className="overview-tree__trigger"
                  disabled={!showDisclosure}
                  onClick={() => {
                    if (showDisclosure) {
                      toggleNode(row.node.id);
                    }
                  }}
                  type="button"
                >
                  {showDisclosure ? (
                    isExpanded ? <ChevronDownIcon size={14} /> : <ChevronRightIcon size={14} />
                  ) : null}
                </button>
                {renderNodeIcon(row.node.kind)}
                <button
                  className="overview-tree__label"
                  onClick={() => {
                    startTransition(() => {
                      onNavigate(nodePath);
                    });
                  }}
                  type="button"
                >
                  {row.node.title}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Stack>
  );
}

type OverviewContextPanelProps = {
  resource: ResourceState<RenderableEntryPayload, RepositoryError>;
  activeHeadingId: string;
  onNavigate: (path: string) => void;
  onScrollToHeading: (headingId: string) => void;
};

export function OverviewContextPanel({
  resource,
  activeHeadingId,
  onNavigate,
  onScrollToHeading,
}: OverviewContextPanelProps) {
  const style = useStyleContext();

  if (resource.tag !== "ready") {
    return (
      <Stack className="overview-rail" gap="sm">
        <div className="overview-rail__title">Context</div>
        <Surface tone="muted">Context appears once the current document is resolved.</Surface>
      </Stack>
    );
  }

  const context = unwrapOr(resource.value.context, {
    breadcrumbs: [],
    parent: none(),
    siblings: [],
    recentEntries: [],
    stats: none(),
  });
  const articleMeta =
    resource.value.content.kind === "article"
      ? getOverviewDocumentMeta(resource.value.content.id)
      : none();

  return (
    <Stack className="overview-rail" gap="sm">
      <div className="overview-rail__title">Context</div>
      <Surface>
        <Stack gap="sm">
          <div className="overview-section-title">Runtime</div>
          <Grid columns={2}>
            <Tag tone="accent">{style.theme}</Tag>
            <Tag>{style.density}</Tag>
            <Tag>{style.layoutMode}</Tag>
            <Tag>{style.motion}</Tag>
          </Grid>
        </Stack>
      </Surface>
      {resource.value.content.kind === "article" ? (
        <Surface>
          <Stack gap="sm">
            <div className="overview-section-title">On this page</div>
            {resource.value.content.toc.map((item) => (
              <button
                className={[
                  "overview-context-link",
                  item.id === activeHeadingId ? "overview-context-link--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={item.id}
                onClick={() => {
                  onScrollToHeading(item.id);
                }}
                type="button"
              >
                {item.title}
              </button>
            ))}
          </Stack>
        </Surface>
      ) : null}
      {isSome(articleMeta) ? (
        <Surface>
          <Stack gap="sm">
            <div className="overview-section-title">Coverage</div>
            <Inline gap="xs" wrap>
              <Tag tone="accent">{articleMeta.value.layer}</Tag>
              <Tag>{articleMeta.value.status}</Tag>
              <Tag>{articleMeta.value.designStatus}</Tag>
            </Inline>
            {articleMeta.value.gaps.length > 0 ? (
              <Stack gap="xs">
                {articleMeta.value.gaps.map((gap) => (
                  <div className="overview-copy" key={gap.id}>{gap.title}</div>
                ))}
              </Stack>
            ) : (
              <div className="overview-copy">No open design gaps on this page.</div>
            )}
          </Stack>
        </Surface>
      ) : null}
      {context.recentEntries.length > 0 ? (
        <Surface>
          <Stack gap="sm">
            <div className="overview-section-title">Recent</div>
            {context.recentEntries.map((entry) => (
              <button
                className="overview-context-link"
                key={entry.id}
                onClick={() => {
                  onNavigate(entry.path);
                }}
                type="button"
              >
                {entry.title}
              </button>
            ))}
          </Stack>
        </Surface>
      ) : null}
    </Stack>
  );
}

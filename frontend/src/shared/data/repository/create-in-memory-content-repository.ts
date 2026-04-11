import type {
  ArticleDocument,
  ArtifactId,
  ChildrenPagePayload,
  ContentNode,
  ContextInfo,
  DirectoryChildSummary,
  DirectoryContent,
  DirectoryStats,
  HomeContent,
  OnboardingState,
  RenderableArtifact,
  RenderableArtifactPayload,
  RepositoryError,
  TreeRootPayload,
  UnsupportedContent,
} from '@/entities/content';
import { DEFAULT_LOCALE, type AppLocale } from '@/shared/lib/i18n/locale.types';
import type { DensityPreference } from '@/shared/lib/style/style.types';
import { ROOT_PATH, normalizePath, pathFromSegments } from '@/shared/lib/path/content-path';
import {
  emptyState,
  errorState,
  readyState,
  type ResourceState,
} from '@/shared/lib/resource/resource-state';
import { type ThemePreference } from '@/shared/lib/theme/theme.types';
import {
  fromNullable,
  isNone,
  isSome,
  none,
  some,
  unwrapOr,
  type Option,
} from '@/shared/lib/monads/option';
import { isErr } from '@/shared/lib/monads/result';
import { createMockContentFixtures, ROOT_NODE_ID } from '@/shared/data/mock/content.fixtures';
import { createBrowserPreferencesAdapter } from '@/shared/data/preferences/browser-preferences-adapter';

import type { ContentRepository } from './repository.types';

type RepositoryOptions = {
  latencyMs: number;
};

type RepositoryOptionsInput = {
  latencyMs: Option<number>;
};

const defaultRepositoryOptions: RepositoryOptions = {
  latencyMs: 120,
};

type LocalizedRepositoryData = ReturnType<typeof buildLocalizedRepositoryData>;

const browserPreferencesAdapter = createBrowserPreferencesAdapter();

function notFound(message: string): RepositoryError {
  return { code: 'not_found', message };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function compareByTreeOrder(left: ContentNode, right: ContentNode, locale: AppLocale): number {
  if (left.kind === 'folder' && right.kind !== 'folder') {
    return -1;
  }

  if (left.kind !== 'folder' && right.kind === 'folder') {
    return 1;
  }

  return left.title.localeCompare(right.title, locale);
}

function sortNodes(nodes: ContentNode[], locale: AppLocale): ContentNode[] {
  return [...nodes].sort((left, right) => compareByTreeOrder(left, right, locale));
}

function sortSummaries(
  entries: DirectoryChildSummary[],
  locale: AppLocale
): DirectoryChildSummary[] {
  return [...entries].sort((left, right) => {
    if (left.kind === 'folder' && right.kind !== 'folder') {
      return -1;
    }

    if (left.kind !== 'folder' && right.kind === 'folder') {
      return 1;
    }

    return left.title.localeCompare(right.title, locale);
  });
}

function getNodePath(node: ContentNode): string {
  return node.kind === 'home' ? ROOT_PATH : pathFromSegments(node.pathSegments);
}

function getNodeArtifactId(node: ContentNode): Option<ArtifactId> {
  return node.artifactId;
}

function getArticleSummary(
  articleDocuments: Record<string, ArticleDocument>,
  artifactId: string
): string {
  const document = articleDocuments[artifactId];

  return document === undefined ? '' : document.summary;
}

function getNodeDescription(
  dataset: LocalizedRepositoryData,
  node: ContentNode,
  locale: AppLocale
): DirectoryChildSummary['description'] {
  if (node.kind === 'folder') {
    return dataset.directoryDescriptions[node.id] ?? none();
  }

  const artifactId = getNodeArtifactId(node);

  if (node.kind === 'article' && isSome(artifactId)) {
    return some(getArticleSummary(dataset.articleDocuments, artifactId.value));
  }

  if (node.kind === 'game') {
    return some(
      locale === 'en-US'
        ? 'Interactive file types are reserved here. A playable experience will plug into this entry in a later iteration.'
        : '交互文件类型预留中，后续版本会在这里接入可玩的内容。'
    );
  }

  if (node.kind === 'media') {
    return some(
      locale === 'en-US'
        ? 'Media entries are already part of the tree, but this version only keeps the entry point and the empty state.'
        : '媒体类型已经进入树结构，但这一期只先保留入口和空态。'
    );
  }

  return none();
}

function toSummary(
  dataset: LocalizedRepositoryData,
  node: ContentNode,
  locale: AppLocale
): DirectoryChildSummary {
  return {
    id: node.id,
    kind: node.kind,
    status: node.status,
    title: node.title,
    slug: node.slug,
    path: getNodePath(node),
    description: getNodeDescription(dataset, node, locale),
    publishedAt: node.publishedAt,
    readingMinutes: node.readingMinutes,
  };
}

function toUnsupportedContent(
  locale: AppLocale,
  node: ContentNode,
  parentPath: string
): UnsupportedContent {
  return {
    kind: 'unsupported',
    title: node.title,
    description:
      node.kind === 'game'
        ? locale === 'en-US'
          ? 'This entry already exists in the filesystem structure, but the current version still focuses on textual reading.'
          : '这个入口已经进入文件系统结构，但当前版本仍以文本阅读为主。'
        : locale === 'en-US'
          ? 'This entry is already reserved in the tree. Media playback will be connected in a later version.'
          : '这个入口已经在树里占位，媒体承载会在后续版本接进来。',
    ctaPath: parentPath,
  };
}

function buildLocalizedRepositoryData(locale: AppLocale) {
  const fixtures = createMockContentFixtures(locale);
  const nodeById: Record<string, ContentNode> = {};
  const nodeByPath: Record<string, ContentNode> = {};
  const childrenByParentId: Record<string, string[]> = {};

  for (const node of fixtures.contentNodes) {
    nodeById[node.id] = node;

    if (node.id !== ROOT_NODE_ID) {
      nodeByPath[getNodePath(node)] = node;
    }

    if (isSome(node.parentId)) {
      const parentId = node.parentId.value;
      childrenByParentId[parentId] = [...(childrenByParentId[parentId] ?? []), node.id];
    }
  }

  const orderedRecentArticleNodes = sortNodes(
    fixtures.contentNodes.filter((node) => node.kind === 'article' && isSome(node.updatedAt)),
    locale
  ).sort((left, right) => {
    const leftDate = unwrapOr(left.updatedAt, '');
    const rightDate = unwrapOr(right.updatedAt, '');

    return rightDate.localeCompare(leftDate);
  });

  return {
    ...fixtures,
    nodeById,
    nodeByPath,
    childrenByParentId,
    orderedRecentArticleNodes,
  };
}

export function createInMemoryContentRepository(
  rawOptions: RepositoryOptionsInput = { latencyMs: none() }
): ContentRepository {
  const options = {
    latencyMs: unwrapOr(rawOptions.latencyMs, defaultRepositoryOptions.latencyMs),
  };
  const datasetCache: Partial<Record<AppLocale, LocalizedRepositoryData>> = {};

  async function withLatency<T>(value: T): Promise<T> {
    await sleep(options.latencyMs);
    return value;
  }

  function getResolvedLocale(): AppLocale {
    const result = browserPreferencesAdapter.getLocalePreference();

    return isErr(result) ? DEFAULT_LOCALE : result.value;
  }

  function getDataset(locale: AppLocale = getResolvedLocale()): LocalizedRepositoryData {
    const cachedDataset = datasetCache[locale];

    if (cachedDataset !== undefined) {
      return cachedDataset;
    }

    const nextDataset = buildLocalizedRepositoryData(locale);
    datasetCache[locale] = nextDataset;
    return nextDataset;
  }

  function getNodeById(dataset: LocalizedRepositoryData, nodeId: string): Option<ContentNode> {
    return fromNullable(dataset.nodeById[nodeId]);
  }

  function getChildren(
    dataset: LocalizedRepositoryData,
    parentId: string,
    locale: AppLocale
  ): ContentNode[] {
    const childIds = dataset.childrenByParentId[parentId] ?? [];

    return sortNodes(
      childIds.flatMap((childId) => {
        const child = getNodeById(dataset, childId);

        return isSome(child) ? [child.value] : [];
      }),
      locale
    );
  }

  function buildDirectoryContent(
    dataset: LocalizedRepositoryData,
    node: ContentNode,
    locale: AppLocale
  ): DirectoryContent {
    return {
      kind: 'directory',
      title: node.title,
      description: dataset.directoryDescriptions[node.id] ?? none(),
      children: sortSummaries(
        getChildren(dataset, node.id, locale).map((child) => toSummary(dataset, child, locale)),
        locale
      ),
    };
  }

  function buildDirectoryStats(
    dataset: LocalizedRepositoryData,
    nodeId: string,
    locale: AppLocale
  ): DirectoryStats {
    const children = getChildren(dataset, nodeId, locale);

    return {
      childCount: children.length,
      folderCount: children.filter((child) => child.kind === 'folder').length,
      articleCount: children.filter((child) => child.kind === 'article').length,
      availableCount: children.filter((child) => child.status === 'available').length,
    };
  }

  function buildBreadcrumbs(
    dataset: LocalizedRepositoryData,
    node: ContentNode
  ): ContextInfo['breadcrumbs'] {
    const breadcrumbs: ContextInfo['breadcrumbs'] = [
      {
        id: ROOT_NODE_ID,
        title: dataset.rootNodeTitle,
        path: ROOT_PATH,
      },
    ];

    for (const ancestorId of node.ancestorIds) {
      if (ancestorId === ROOT_NODE_ID) {
        continue;
      }

      const ancestor = getNodeById(dataset, ancestorId);

      if (isSome(ancestor)) {
        breadcrumbs.push({
          id: ancestor.value.id,
          title: ancestor.value.title,
          path: getNodePath(ancestor.value),
        });
      }
    }

    breadcrumbs.push({
      id: node.id,
      title: node.title,
      path: getNodePath(node),
    });

    return breadcrumbs;
  }

  function buildContextInfo(
    dataset: LocalizedRepositoryData,
    node: ContentNode,
    locale: AppLocale
  ): ContextInfo {
    const parentNode: Option<ContentNode> =
      isSome(node.parentId) && node.parentId.value !== ROOT_NODE_ID
        ? getNodeById(dataset, node.parentId.value)
        : none();
    const siblingSummaries = !isSome(parentNode)
      ? []
      : getChildren(dataset, parentNode.value.id, locale)
          .filter((child) => child.id !== node.id)
          .map((child) => toSummary(dataset, child, locale))
          .slice(0, 4);
    const recentEntries =
      node.kind === 'folder'
        ? buildDirectoryContent(dataset, node, locale).children.slice(0, 4)
        : dataset.orderedRecentArticleNodes
            .map((entry) => toSummary(dataset, entry, locale))
            .slice(0, 4);

    return {
      breadcrumbs: buildBreadcrumbs(dataset, node),
      parent: isSome(parentNode) ? some(toSummary(dataset, parentNode.value, locale)) : none(),
      siblings: siblingSummaries,
      recentEntries,
      stats: node.kind === 'folder' ? some(buildDirectoryStats(dataset, node.id, locale)) : none(),
    };
  }

  function resolveRenderableArtifact(
    dataset: LocalizedRepositoryData,
    node: ContentNode,
    locale: AppLocale
  ): Option<RenderableArtifact> {
    const artifactId = getNodeArtifactId(node);

    if (node.kind === 'home' && isSome(artifactId)) {
      return fromNullable(dataset.homeContents[artifactId.value]);
    }

    if (node.kind === 'folder') {
      return some(buildDirectoryContent(dataset, node, locale));
    }

    if (node.kind === 'article' && isSome(artifactId)) {
      return fromNullable(dataset.articleDocuments[artifactId.value]);
    }

    if (node.kind === 'game' || node.kind === 'media') {
      const parentPath =
        isSome(node.parentId) && node.parentId.value !== ROOT_NODE_ID
          ? (() => {
              const parentNode = getNodeById(dataset, node.parentId.value);

              return isSome(parentNode) ? getNodePath(parentNode.value) : ROOT_PATH;
            })()
          : ROOT_PATH;

      return some(toUnsupportedContent(locale, node, parentPath));
    }

    return none();
  }

  async function loadRenderableArtifactByPath(
    path: string
  ): Promise<ResourceState<RenderableArtifactPayload, RepositoryError>> {
    const locale = getResolvedLocale();
    const dataset = getDataset(locale);
    const normalizedPath = normalizePath(path);
    const node = dataset.nodeByPath[normalizedPath];

    if (node === undefined) {
      return withLatency(
        errorState(
          notFound(
            locale === 'en-US'
              ? `Path ${normalizedPath} was not found.`
              : `路径 ${normalizedPath} 未找到。`
          )
        )
      );
    }

    const artifact = resolveRenderableArtifact(dataset, node, locale);

    if (isNone(artifact)) {
      return withLatency(
        emptyState(
          some(
            locale === 'en-US'
              ? `No renderable content for ${normalizedPath}.`
              : `${normalizedPath} 当前没有可渲染内容。`
          )
        )
      );
    }

    return withLatency(
      readyState({
        node,
        artifact: artifact.value,
        content: artifact.value,
        context: some(buildContextInfo(dataset, node, locale)),
      })
    );
  }

  return {
    getRenderableArtifactByPath(path) {
      return loadRenderableArtifactByPath(path);
    },
    async getTreeRoot() {
      const locale = getResolvedLocale();
      const dataset = getDataset(locale);
      const rootChildren = getChildren(dataset, ROOT_NODE_ID, locale);
      const secondLevel = rootChildren.flatMap((node) =>
        node.kind === 'folder' ? getChildren(dataset, node.id, locale) : []
      );

      return withLatency(
        readyState<TreeRootPayload, RepositoryError>({
          rootId: ROOT_NODE_ID,
          nodes: [dataset.nodeById[ROOT_NODE_ID], ...rootChildren, ...secondLevel],
        })
      );
    },
    async loadChildren(nodeId, page) {
      const locale = getResolvedLocale();
      const dataset = getDataset(locale);
      const node = getNodeById(dataset, nodeId);
      const supportsRequestedPage = page === 1;

      if (isNone(node)) {
        return withLatency(
          errorState(
            notFound(
              locale === 'en-US' ? `Node ${nodeId} was not found.` : `节点 ${nodeId} 未找到。`
            )
          )
        );
      }

      if (!supportsRequestedPage) {
        return withLatency(
          readyState<ChildrenPagePayload, RepositoryError>({
            parentId: nodeId,
            nodes: [],
            nextPage: none(),
          })
        );
      }

      return withLatency(
        readyState<ChildrenPagePayload, RepositoryError>({
          parentId: nodeId,
          nodes: getChildren(dataset, nodeId, locale),
          nextPage: none(),
        })
      );
    },
    async getNodeByPath(path) {
      const locale = getResolvedLocale();
      const dataset = getDataset(locale);
      const normalizedPath = normalizePath(path);
      const node = dataset.nodeByPath[normalizedPath];

      return node === undefined
        ? withLatency(
            errorState(
              notFound(
                locale === 'en-US'
                  ? `Path ${normalizedPath} was not found.`
                  : `路径 ${normalizedPath} 未找到。`
              )
            )
          )
        : withLatency(readyState(node));
    },
    async getHomeContentById(artifactId) {
      const locale = getResolvedLocale();
      const dataset = getDataset(locale);
      const content = dataset.homeContents[artifactId];

      return content === undefined
        ? withLatency(
            errorState(
              notFound(
                locale === 'en-US'
                  ? `Home artifact ${artifactId} was not found.`
                  : `首页 artifact ${artifactId} 未找到。`
              )
            )
          )
        : withLatency(readyState<HomeContent, RepositoryError>(content));
    },
    async getDirectoryContentByNodeId(nodeId) {
      const locale = getResolvedLocale();
      const dataset = getDataset(locale);
      const node = getNodeById(dataset, nodeId);

      if (isNone(node) || node.value.kind !== 'folder') {
        return withLatency(
          errorState(
            notFound(
              locale === 'en-US' ? `Directory ${nodeId} was not found.` : `目录 ${nodeId} 未找到。`
            )
          )
        );
      }

      return withLatency(
        readyState<DirectoryContent, RepositoryError>(
          buildDirectoryContent(dataset, node.value, locale)
        )
      );
    },
    async getArticleDocumentById(artifactId) {
      const locale = getResolvedLocale();
      const dataset = getDataset(locale);
      const document = dataset.articleDocuments[artifactId];

      return document === undefined
        ? withLatency(
            errorState(
              notFound(
                locale === 'en-US'
                  ? `Article ${artifactId} was not found.`
                  : `文章 ${artifactId} 未找到。`
              )
            )
          )
        : withLatency(readyState<ArticleDocument, RepositoryError>(document));
    },
    async getContextInfoByPath(path) {
      const locale = getResolvedLocale();
      const dataset = getDataset(locale);
      const normalizedPath = normalizePath(path);
      const node = dataset.nodeByPath[normalizedPath];

      return node === undefined
        ? withLatency(
            errorState(
              notFound(
                locale === 'en-US'
                  ? `Path ${normalizedPath} was not found.`
                  : `路径 ${normalizedPath} 未找到。`
              )
            )
          )
        : withLatency(
            readyState<ContextInfo, RepositoryError>(buildContextInfo(dataset, node, locale))
          );
    },
    async getThemePreference() {
      const result = browserPreferencesAdapter.getThemePreference();

      return isErr(result)
        ? withLatency(errorState(result.error))
        : withLatency(readyState<ThemePreference, RepositoryError>(result.value));
    },
    async setThemePreference(theme) {
      const result = browserPreferencesAdapter.setThemePreference(theme);

      return isErr(result)
        ? withLatency(errorState(result.error))
        : withLatency(readyState<ThemePreference, RepositoryError>(result.value));
    },
    async getDensityPreference() {
      const result = browserPreferencesAdapter.getDensityPreference();

      return isErr(result)
        ? withLatency(errorState(result.error))
        : withLatency(readyState<DensityPreference, RepositoryError>(result.value));
    },
    async setDensityPreference(density) {
      const result = browserPreferencesAdapter.setDensityPreference(density);

      return isErr(result)
        ? withLatency(errorState(result.error))
        : withLatency(readyState<DensityPreference, RepositoryError>(result.value));
    },
    async getLocalePreference() {
      const result = browserPreferencesAdapter.getLocalePreference();

      return isErr(result)
        ? withLatency(errorState(result.error))
        : withLatency(readyState(result.value));
    },
    async setLocalePreference(locale) {
      const result = browserPreferencesAdapter.setLocalePreference(locale);

      return isErr(result)
        ? withLatency(errorState(result.error))
        : withLatency(readyState(result.value));
    },
    async getOnboardingState() {
      const result = browserPreferencesAdapter.getOnboardingState();

      return isErr(result)
        ? withLatency(errorState(result.error))
        : withLatency(readyState<OnboardingState, RepositoryError>(result.value));
    },
    async dismissOnboarding() {
      const result = browserPreferencesAdapter.dismissOnboarding();

      return isErr(result)
        ? withLatency(errorState(result.error))
        : withLatency(readyState<OnboardingState, RepositoryError>(result.value));
    },
    async getSavedReadingProgress(artifactIdentity) {
      const result = browserPreferencesAdapter.getSavedReadingProgress(artifactIdentity);

      return isErr(result)
        ? withLatency(errorState(result.error))
        : withLatency(readyState(result.value));
    },
    async saveReadingProgress(artifactIdentity, position) {
      const result = browserPreferencesAdapter.saveReadingProgress(artifactIdentity, position);

      return isErr(result)
        ? withLatency(errorState(result.error))
        : withLatency(readyState(result.value));
    },
  };
}

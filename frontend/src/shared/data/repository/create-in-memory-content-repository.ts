import type {
  ArticleDocument,
  ChildrenPagePayload,
  ContentNode,
  ContextInfo,
  DirectoryChildSummary,
  DirectoryContent,
  DirectoryStats,
  HomeContent,
  OnboardingState,
  ReadingProgress,
  RenderableContent,
  RenderableEntryPayload,
  RepositoryError,
  TreeRootPayload,
  UnsupportedContent,
} from "@/entities/content";
import { ROOT_PATH, normalizePath, pathFromSegments } from "@/shared/lib/path/content-path";
import {
  emptyState,
  errorState,
  readyState,
  type ResourceState,
} from "@/shared/lib/resource/resource-state";
import { type ThemePreference } from "@/shared/lib/theme/theme.types";
import { isNone, isSome, none, some, unwrapOr } from "@/shared/lib/monads/option";
import {
  mockArticleDocuments,
  mockContentNodes,
  mockDirectoryDescriptions,
  mockHomeContents,
  ROOT_NODE_ID,
  ROOT_NODE_TITLE,
} from "@/shared/data/mock/content.fixtures";
import { createBrowserPreferencesAdapter } from "@/shared/data/preferences/browser-preferences-adapter";

import type { ContentRepository } from "./repository.types";

type RepositoryOptions = {
  latencyMs: number;
};

type RepositoryOptionsInput = {
  latencyMs: import("@/shared/lib/monads/option").Option<number>;
};

const defaultRepositoryOptions: RepositoryOptions = {
  latencyMs: 120,
};

const browserPreferencesAdapter = createBrowserPreferencesAdapter();

function notFound(message: string): RepositoryError {
  return { code: "not_found", message };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function compareByTreeOrder(left: ContentNode, right: ContentNode): number {
  if (left.kind === "folder" && right.kind !== "folder") {
    return -1;
  }

  if (left.kind !== "folder" && right.kind === "folder") {
    return 1;
  }

  return left.title.localeCompare(right.title, "zh-CN");
}

function sortNodes(nodes: ContentNode[]): ContentNode[] {
  return [...nodes].sort(compareByTreeOrder);
}

function sortSummaries(entries: DirectoryChildSummary[]): DirectoryChildSummary[] {
  return [...entries].sort((left, right) => {
    if (left.kind === "folder" && right.kind !== "folder") {
      return -1;
    }

    if (left.kind !== "folder" && right.kind === "folder") {
      return 1;
    }

    return left.title.localeCompare(right.title, "zh-CN");
  });
}

function getNodePath(node: ContentNode): string {
  return node.kind === "home" ? ROOT_PATH : pathFromSegments(node.pathSegments);
}

function getArticleSummary(documentId: string): string {
  const document = mockArticleDocuments[documentId];

  return document === undefined ? "" : document.summary;
}

function getNodeDescription(node: ContentNode): DirectoryChildSummary["description"] {
  if (node.kind === "folder") {
    return mockDirectoryDescriptions[node.id] ?? none();
  }

  if (node.kind === "article" && isSome(node.documentId)) {
    return some(getArticleSummary(node.documentId.value));
  }

  if (node.kind === "game") {
    return some("交互文件类型预留中，后续版本会在这里接入可玩的内容。");
  }

  if (node.kind === "media") {
    return some("媒体类型已经进入树结构，但这一期只先保留入口和空态。");
  }

  return none();
}

function toSummary(node: ContentNode): DirectoryChildSummary {
  return {
    id: node.id,
    kind: node.kind,
    status: node.status,
    title: node.title,
    slug: node.slug,
    path: getNodePath(node),
    description: getNodeDescription(node),
    publishedAt: node.publishedAt,
    readingMinutes: node.readingMinutes,
  };
}

function toUnsupportedContent(node: ContentNode, parentPath: string): UnsupportedContent {
  return {
    kind: "unsupported",
    title: node.title,
    description:
      node.kind === "game"
        ? "这个入口已经进入文件系统结构，但当前版本仍以文本阅读为主。"
        : "这个入口已经在树里占位，媒体承载会在后续版本接进来。",
    ctaPath: parentPath,
  };
}

export function createInMemoryContentRepository(
  rawOptions: RepositoryOptionsInput = { latencyMs: none<number>() },
): ContentRepository {
  const options = {
    latencyMs: unwrapOr(rawOptions.latencyMs, defaultRepositoryOptions.latencyMs),
  };

  const nodeById: Record<string, ContentNode> = {};
  const nodeByPath: Record<string, ContentNode> = {};
  const childrenByParentId: Record<string, string[]> = {};

  for (const node of mockContentNodes) {
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
    mockContentNodes.filter(
      (node) => node.kind === "article" && isSome(node.updatedAt),
    ),
  ).sort((left, right) => {
    const leftDate = unwrapOr(left.updatedAt, "");
    const rightDate = unwrapOr(right.updatedAt, "");

    return rightDate.localeCompare(leftDate);
  });

  async function withLatency<T>(value: T): Promise<T> {
    await sleep(options.latencyMs);
    return value;
  }

  function getNodeById(nodeId: string): ContentNode | null {
    return nodeById[nodeId] ?? null;
  }

  function getChildren(parentId: string): ContentNode[] {
    const childIds = childrenByParentId[parentId] ?? [];

    return sortNodes(
      childIds
        .map((childId) => getNodeById(childId))
        .filter((node): node is ContentNode => node !== null),
    );
  }

  function buildDirectoryContent(node: ContentNode): DirectoryContent {
    return {
      kind: "directory",
      title: node.title,
      description: mockDirectoryDescriptions[node.id] ?? none(),
      children: sortSummaries(getChildren(node.id).map(toSummary)),
    };
  }

  function buildDirectoryStats(nodeId: string): DirectoryStats {
    const children = getChildren(nodeId);

    return {
      childCount: children.length,
      folderCount: children.filter((child) => child.kind === "folder").length,
      articleCount: children.filter((child) => child.kind === "article").length,
      availableCount: children.filter((child) => child.status === "available").length,
    };
  }

  function buildBreadcrumbs(node: ContentNode): ContextInfo["breadcrumbs"] {
    const breadcrumbs: ContextInfo["breadcrumbs"] = [
      {
        id: ROOT_NODE_ID,
        title: ROOT_NODE_TITLE,
        path: ROOT_PATH,
      },
    ];

    for (const ancestorId of node.ancestorIds) {
      if (ancestorId === ROOT_NODE_ID) {
        continue;
      }

      const ancestor = getNodeById(ancestorId);

      if (ancestor !== null) {
        breadcrumbs.push({
          id: ancestor.id,
          title: ancestor.title,
          path: getNodePath(ancestor),
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

  function buildContextInfo(node: ContentNode): ContextInfo {
    const parentNode =
      isSome(node.parentId) && node.parentId.value !== ROOT_NODE_ID
        ? getNodeById(node.parentId.value)
        : null;
    const siblingSummaries =
      parentNode === null
        ? []
        : getChildren(parentNode.id)
            .filter((child) => child.id !== node.id)
            .map(toSummary)
            .slice(0, 4);
    const recentEntries =
      node.kind === "folder"
        ? buildDirectoryContent(node).children.slice(0, 4)
        : orderedRecentArticleNodes.map(toSummary).slice(0, 4);

    return {
      breadcrumbs: buildBreadcrumbs(node),
      parent: parentNode === null ? none() : some(toSummary(parentNode)),
      siblings: siblingSummaries,
      recentEntries,
      stats: node.kind === "folder" ? some(buildDirectoryStats(node.id)) : none(),
    };
  }

  function getRenderableContent(node: ContentNode): RenderableContent | null {
    if (node.kind === "home" && isSome(node.documentId)) {
      return mockHomeContents[node.documentId.value] ?? null;
    }

    if (node.kind === "folder") {
      return buildDirectoryContent(node);
    }

    if (node.kind === "article" && isSome(node.documentId)) {
      return mockArticleDocuments[node.documentId.value] ?? null;
    }

    if (node.kind === "game" || node.kind === "media") {
      const parentPath =
        isSome(node.parentId) && node.parentId.value !== ROOT_NODE_ID
          ? getNodePath(nodeById[node.parentId.value])
          : ROOT_PATH;

      return toUnsupportedContent(node, parentPath);
    }

    return null;
  }

  async function getRenderableEntry(
    path: string,
  ): Promise<ResourceState<RenderableEntryPayload, RepositoryError>> {
    const normalizedPath = normalizePath(path);
    const node = nodeByPath[normalizedPath];

    if (node === undefined) {
      return withLatency(errorState(notFound(`Path ${normalizedPath} was not found.`)));
    }

    const content = getRenderableContent(node);

    if (content === null) {
      return withLatency(emptyState(some(`No renderable content for ${normalizedPath}.`)));
    }

    return withLatency(
      readyState({
        node,
        content,
        context: some(buildContextInfo(node)),
      }),
    );
  }

  return {
    getRenderableEntryByPath(path) {
      return getRenderableEntry(path);
    },
    async getTreeRoot() {
      const rootChildren = getChildren(ROOT_NODE_ID);
      const secondLevel = rootChildren.flatMap((node) =>
        node.kind === "folder" ? getChildren(node.id) : [],
      );

      return withLatency(
        readyState<TreeRootPayload, RepositoryError>({
          rootId: ROOT_NODE_ID,
          nodes: [nodeById[ROOT_NODE_ID], ...rootChildren, ...secondLevel],
        }),
      );
    },
    async loadChildren(nodeId, _page) {
      const node = getNodeById(nodeId);

      if (node === null) {
        return withLatency(errorState(notFound(`Node ${nodeId} was not found.`)));
      }

      return withLatency(
        readyState<ChildrenPagePayload, RepositoryError>({
          parentId: nodeId,
          nodes: getChildren(nodeId),
          nextPage: none(),
        }),
      );
    },
    async getNodeByPath(path) {
      const normalizedPath = normalizePath(path);
      const node = nodeByPath[normalizedPath];

      return node === undefined
        ? withLatency(errorState(notFound(`Path ${normalizedPath} was not found.`)))
        : withLatency(readyState(node));
    },
    async getHomeContentById(documentId) {
      const content = mockHomeContents[documentId];

      return content === undefined
        ? withLatency(errorState(notFound(`Home document ${documentId} was not found.`)))
        : withLatency(readyState<HomeContent, RepositoryError>(content));
    },
    async getDirectoryContentByNodeId(nodeId) {
      const node = getNodeById(nodeId);

      if (node === null || node.kind !== "folder") {
        return withLatency(errorState(notFound(`Directory ${nodeId} was not found.`)));
      }

      return withLatency(readyState<DirectoryContent, RepositoryError>(buildDirectoryContent(node)));
    },
    async getArticleDocumentById(documentId) {
      const document = mockArticleDocuments[documentId];

      return document === undefined
        ? withLatency(errorState(notFound(`Article ${documentId} was not found.`)))
        : withLatency(readyState<ArticleDocument, RepositoryError>(document));
    },
    async getContextInfoByPath(path) {
      const normalizedPath = normalizePath(path);
      const node = nodeByPath[normalizedPath];

      return node === undefined
        ? withLatency(errorState(notFound(`Path ${normalizedPath} was not found.`)))
        : withLatency(readyState<ContextInfo, RepositoryError>(buildContextInfo(node)));
    },
    async getThemePreference() {
      const result = browserPreferencesAdapter.getThemePreference();

      return result.tag === "err"
        ? withLatency(errorState(result.error))
        : withLatency(readyState<ThemePreference, RepositoryError>(result.value));
    },
    async setThemePreference(theme) {
      const result = browserPreferencesAdapter.setThemePreference(theme);

      return result.tag === "err"
        ? withLatency(errorState(result.error))
        : withLatency(readyState<ThemePreference, RepositoryError>(result.value));
    },
    async getOnboardingState() {
      const result = browserPreferencesAdapter.getOnboardingState();

      return result.tag === "err"
        ? withLatency(errorState(result.error))
        : withLatency(readyState<OnboardingState, RepositoryError>(result.value));
    },
    async dismissOnboarding() {
      const result = browserPreferencesAdapter.dismissOnboarding();

      return result.tag === "err"
        ? withLatency(errorState(result.error))
        : withLatency(readyState<OnboardingState, RepositoryError>(result.value));
    },
    async getSavedReadingProgress(path) {
      const normalizedPath = normalizePath(path);
      const result = browserPreferencesAdapter.getSavedReadingProgress(normalizedPath);

      return result.tag === "err"
        ? withLatency(errorState(result.error))
        : withLatency(readyState(result.value));
    },
    async saveReadingProgress(path, position) {
      const normalizedPath = normalizePath(path);
      const result = browserPreferencesAdapter.saveReadingProgress(
        normalizedPath,
        position,
      );

      return result.tag === "err"
        ? withLatency(errorState(result.error))
        : withLatency(readyState(result.value));
    },
  };
}

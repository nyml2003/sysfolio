import type { Option } from '@/shared/lib/monads/option';
import type { ResourceState } from '@/shared/lib/resource/resource-state';

export type NodeId = string;
export type ArtifactId = string;
export type Timestamp = string;

export type ContentKind = 'folder' | 'home' | 'article' | 'game' | 'media' | 'unknown';

export type ContentStatus = 'available' | 'coming_soon' | 'external';

export type ContentNode = {
  id: NodeId;
  kind: ContentKind;
  status: ContentStatus;
  title: string;
  slug: string;
  parentId: Option<NodeId>;
  ancestorIds: NodeId[];
  pathSegments: string[];
  childrenCount: number;
  hasChildren: boolean;
  artifactId: Option<ArtifactId>;
  publishedAt: Option<Timestamp>;
  updatedAt: Option<Timestamp>;
  readingMinutes: Option<number>;
};

export type BreadcrumbSegment = {
  id: string;
  title: string;
  path: string;
};

export type DirectoryChildSummary = {
  id: NodeId;
  kind: ContentKind;
  status: ContentStatus;
  title: string;
  slug: string;
  path: string;
  description: Option<string>;
  publishedAt: Option<Timestamp>;
  readingMinutes: Option<number>;
};

export type HomeContent = {
  kind: 'home';
  title: string;
};

export type DirectoryContent = {
  kind: 'directory';
  title: string;
  description: Option<string>;
  children: DirectoryChildSummary[];
};

export type TocItem = {
  id: string;
  title: string;
  level: 2 | 3 | 4;
};

export type ArticleSection = {
  id: string;
  title: string;
  level: 2 | 3 | 4;
  paragraphs: string[];
};

export type ArticleDocument = {
  kind: 'article';
  id: ArtifactId;
  title: string;
  summary: string;
  eyebrow: string;
  toc: TocItem[];
  sections: ArticleSection[];
};

export type UnsupportedContent = {
  kind: 'unsupported';
  title: string;
  description: string;
  ctaPath: string;
};

export type RenderableArtifact =
  | HomeContent
  | DirectoryContent
  | ArticleDocument
  | UnsupportedContent;

export type DirectoryStats = {
  childCount: number;
  folderCount: number;
  articleCount: number;
  availableCount: number;
};

export type ContextInfo = {
  breadcrumbs: BreadcrumbSegment[];
  parent: Option<DirectoryChildSummary>;
  siblings: DirectoryChildSummary[];
  recentEntries: DirectoryChildSummary[];
  stats: Option<DirectoryStats>;
};

export type RenderableArtifactPayload = {
  node: ContentNode;
  artifact: RenderableArtifact;
  context: Option<ContextInfo>;
};

export type TreeRootPayload = {
  rootId: NodeId;
  nodes: ContentNode[];
};

export type ChildrenPagePayload = {
  parentId: NodeId;
  nodes: ContentNode[];
  nextPage: Option<number>;
};

export type RepositoryError = {
  code: 'invalid_path' | 'not_found' | 'storage_error' | 'unknown';
  message: string;
};

export type OnboardingState = {
  dismissed: boolean;
};

export type ReadingProgress = {
  scrollTop: number;
  updatedAt: Timestamp;
};

export type RenderableArtifactResource = ResourceState<RenderableArtifactPayload, RepositoryError>;

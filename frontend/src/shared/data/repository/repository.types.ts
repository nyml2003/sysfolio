import type {
  ArticleDocument,
  ChildrenPagePayload,
  ContentNode,
  ContextInfo,
  DirectoryContent,
  HomeContent,
  OnboardingState,
  ReadingProgress,
  RenderableEntryResource,
  RepositoryError,
  TreeRootPayload,
} from "@/entities/content";
import type { Option } from "@/shared/lib/monads/option";
import type { ResourceState } from "@/shared/lib/resource/resource-state";
import type { ThemePreference } from "@/shared/lib/theme/theme.types";

export interface ContentRepository {
  getRenderableEntryByPath(path: string): Promise<RenderableEntryResource>;
  getTreeRoot(): Promise<ResourceState<TreeRootPayload, RepositoryError>>;
  loadChildren(
    nodeId: string,
    page: number,
  ): Promise<ResourceState<ChildrenPagePayload, RepositoryError>>;
  getNodeByPath(path: string): Promise<ResourceState<ContentNode, RepositoryError>>;
  getHomeContentById(
    documentId: string,
  ): Promise<ResourceState<HomeContent, RepositoryError>>;
  getDirectoryContentByNodeId(
    nodeId: string,
  ): Promise<ResourceState<DirectoryContent, RepositoryError>>;
  getArticleDocumentById(
    documentId: string,
  ): Promise<ResourceState<ArticleDocument, RepositoryError>>;
  getContextInfoByPath(
    path: string,
  ): Promise<ResourceState<ContextInfo, RepositoryError>>;
  getThemePreference(): Promise<ResourceState<ThemePreference, RepositoryError>>;
  setThemePreference(
    theme: ThemePreference,
  ): Promise<ResourceState<ThemePreference, RepositoryError>>;
  getOnboardingState(): Promise<ResourceState<OnboardingState, RepositoryError>>;
  dismissOnboarding(): Promise<ResourceState<OnboardingState, RepositoryError>>;
  getSavedReadingProgress(
    path: string,
  ): Promise<ResourceState<Option<ReadingProgress>, RepositoryError>>;
  saveReadingProgress(
    path: string,
    position: ReadingProgress,
  ): Promise<ResourceState<ReadingProgress, RepositoryError>>;
}

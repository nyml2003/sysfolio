import type {
  ArticleDocument,
  ArtifactId,
  ChildrenPagePayload,
  ContentNode,
  ContextInfo,
  DirectoryContent,
  HomeContent,
  OnboardingState,
  ReadingProgress,
  RenderableArtifactResource,
  RepositoryError,
  TreeRootPayload,
} from '@/entities/content';
import type { Option } from '@/shared/lib/monads/option';
import type { ResourceState } from '@/shared/lib/resource/resource-state';
import type { AppLocale } from '@/shared/lib/i18n/locale.types';
import type { DensityPreference } from '@/shared/lib/style/style.types';
import type { ThemePreference } from '@/shared/lib/theme/theme.types';

export interface ContentRepository {
  getRenderableArtifactByPath(path: string): Promise<RenderableArtifactResource>;
  getTreeRoot(): Promise<ResourceState<TreeRootPayload, RepositoryError>>;
  loadChildren(
    nodeId: string,
    page: number
  ): Promise<ResourceState<ChildrenPagePayload, RepositoryError>>;
  getNodeByPath(path: string): Promise<ResourceState<ContentNode, RepositoryError>>;
  getHomeContentById(artifactId: ArtifactId): Promise<ResourceState<HomeContent, RepositoryError>>;
  getDirectoryContentByNodeId(
    nodeId: string
  ): Promise<ResourceState<DirectoryContent, RepositoryError>>;
  getArticleDocumentById(
    artifactId: ArtifactId
  ): Promise<ResourceState<ArticleDocument, RepositoryError>>;
  getContextInfoByPath(path: string): Promise<ResourceState<ContextInfo, RepositoryError>>;
  getThemePreference(): Promise<ResourceState<ThemePreference, RepositoryError>>;
  setThemePreference(
    theme: ThemePreference
  ): Promise<ResourceState<ThemePreference, RepositoryError>>;
  getDensityPreference(): Promise<ResourceState<DensityPreference, RepositoryError>>;
  setDensityPreference(
    density: DensityPreference
  ): Promise<ResourceState<DensityPreference, RepositoryError>>;
  getLocalePreference(): Promise<ResourceState<AppLocale, RepositoryError>>;
  setLocalePreference(locale: AppLocale): Promise<ResourceState<AppLocale, RepositoryError>>;
  getOnboardingState(): Promise<ResourceState<OnboardingState, RepositoryError>>;
  dismissOnboarding(): Promise<ResourceState<OnboardingState, RepositoryError>>;
  getSavedReadingProgress(
    artifactIdentity: string
  ): Promise<ResourceState<Option<ReadingProgress>, RepositoryError>>;
  saveReadingProgress(
    artifactIdentity: string,
    position: ReadingProgress
  ): Promise<ResourceState<ReadingProgress, RepositoryError>>;
}

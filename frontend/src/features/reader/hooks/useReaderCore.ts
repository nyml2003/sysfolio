import { useEffect, useMemo, useState } from 'react';

import type { ArticleDocument, BreadcrumbSegment } from '@/entities/content';
import { useFileTree } from '@/features/file-tree/hooks/useFileTree';
import {
  useReaderArtifactQuery,
  type ReaderArtifactQuery,
} from '@/features/reader/hooks/useReaderArtifactQuery';
import {
  useReaderContextQuery,
  type ReaderContextQuery,
} from '@/features/reader/hooks/useReaderContextQuery';
import { useReaderReadingSession } from '@/features/reader/hooks/useReaderReadingSession';
import { useUiCopy } from '@/shared/lib/i18n/use-ui-copy';
import { none, some, type Option } from '@/shared/lib/monads/option';
import { useStyleContext } from '@/shared/ui/foundation';

import { buildFallbackBreadcrumbs } from '@/app/app-shell.model';

type ReaderOverlay = 'none' | 'navigation' | 'context';

export type ReaderCoreState = {
  currentPath: string;
  artifactIdentity: Option<string>;
  artifactQuery: ReaderArtifactQuery;
  breadcrumbs: BreadcrumbSegment[];
  contextQuery: ReaderContextQuery;
  overlay: {
    activeOverlay: ReaderOverlay;
  };
  pathBarLoading: boolean;
  reading: ReturnType<typeof useReaderReadingSession>;
  tree: ReturnType<typeof useFileTree>;
};

export type ReaderCoreActions = {
  closeOverlay: () => void;
  openContextOverlay: () => void;
  openNavigationOverlay: () => void;
  reloadContent: () => void;
  scrollToHeading: (headingId: string) => void;
  scrollToTop: () => void;
  toggleTreeNode: (nodeId: string) => void;
  retryTreeNode: (nodeId: string) => void;
};

type UseReaderCoreResult = {
  actions: ReaderCoreActions;
  state: ReaderCoreState;
};

function getArticleDocument(artifactQuery: ReaderArtifactQuery): Option<ArticleDocument> {
  if (
    artifactQuery.resource.tag !== 'ready' ||
    artifactQuery.resource.value.artifact.kind !== 'article'
  ) {
    return none();
  }

  return some(artifactQuery.resource.value.artifact);
}

function getArtifactIdentity(artifactQuery: ReaderArtifactQuery): Option<string> {
  if (
    artifactQuery.resource.tag !== 'ready' ||
    artifactQuery.resource.value.artifact.kind !== 'article'
  ) {
    return none();
  }

  return some(artifactQuery.resource.value.artifact.id);
}

export function useReaderCore(currentPath: string): UseReaderCoreResult {
  const copy = useUiCopy();
  const { layoutMode } = useStyleContext();
  const artifactQuery = useReaderArtifactQuery(currentPath);
  const contextQuery = useReaderContextQuery(currentPath);
  const tree = useFileTree(currentPath);
  const fallbackBreadcrumbs = buildFallbackBreadcrumbs(currentPath, copy.common.homeTitle);
  const [activeOverlay, setActiveOverlay] = useState<ReaderOverlay>('none');
  const articleDocument = useMemo(() => getArticleDocument(artifactQuery), [artifactQuery]);
  const artifactIdentity = useMemo(() => getArtifactIdentity(artifactQuery), [artifactQuery]);
  const reading = useReaderReadingSession({
    path: currentPath,
    document: articleDocument,
    artifactIdentity,
  });

  const breadcrumbs =
    contextQuery.resource.tag === 'ready'
      ? contextQuery.resource.value.breadcrumbs
      : fallbackBreadcrumbs;
  const pathBarLoading =
    contextQuery.resource.tag === 'idle' || contextQuery.resource.tag === 'loading';

  useEffect(() => {
    setActiveOverlay('none');
  }, [currentPath, layoutMode]);

  return {
    actions: {
      closeOverlay() {
        setActiveOverlay('none');
      },
      openContextOverlay() {
        setActiveOverlay('context');
      },
      openNavigationOverlay() {
        setActiveOverlay('navigation');
      },
      reloadContent() {
        artifactQuery.reload();
        contextQuery.reload();
      },
      scrollToHeading(headingId) {
        reading.scrollToHeading(headingId);
      },
      scrollToTop() {
        reading.scrollToTop();
      },
      toggleTreeNode(nodeId) {
        tree.toggleNode(nodeId);
      },
      retryTreeNode(nodeId) {
        tree.retryNode(nodeId);
      },
    },
    state: {
      currentPath,
      artifactIdentity,
      artifactQuery,
      breadcrumbs,
      contextQuery,
      overlay: {
        activeOverlay,
      },
      pathBarLoading,
      reading,
      tree,
    },
  };
}

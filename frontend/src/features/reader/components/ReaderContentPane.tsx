import type { RenderableArtifactPayload, RepositoryError } from '@/entities/content';
import { ContentPane } from '@/features/content-pane/components/ContentPane';
import { none, some } from '@/shared/lib/monads/option';
import { readyState, type ResourceState } from '@/shared/lib/resource/resource-state';

import { useReaderActions } from '../hooks/useReaderActions';
import { useReaderSelector } from '../hooks/useReaderSelector';

type ReaderContentPaneProps = {
  onNavigate: (path: string) => void;
};

export function ReaderContentPane({ onNavigate }: ReaderContentPaneProps) {
  const { scrollToTop } = useReaderActions();
  const contextQuery = useReaderSelector((state) => state.contextQuery);
  const artifactResource = useReaderSelector((state) => state.artifactQuery.resource);
  const restoreNoticeVisible = useReaderSelector(
    (state) => state.reading.state.restoreNoticeVisible
  );
  const resource: ResourceState<RenderableArtifactPayload, RepositoryError> =
    artifactResource.tag === 'ready'
      ? readyState({
          node: artifactResource.value.node,
          artifact: artifactResource.value.artifact,
          content: artifactResource.value.artifact,
          context:
            contextQuery.resource.tag === 'ready' ? some(contextQuery.resource.value) : none(),
        })
      : artifactResource;

  return (
    <ContentPane
      onNavigate={onNavigate}
      resource={resource}
      restoreNoticeVisible={restoreNoticeVisible}
      scrollToTop={scrollToTop}
    />
  );
}

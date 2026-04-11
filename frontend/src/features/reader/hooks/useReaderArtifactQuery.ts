import { useCallback, useMemo } from 'react';

import type { ContentNode, RenderableArtifact, RepositoryError } from '@/entities/content';
import { useContentRepository } from '@/shared/data/repository';
import { useResourceQuery, type ResourceQuery } from '@/shared/lib/query';
import { readyState } from '@/shared/lib/resource/resource-state';
import { usePreferences } from '@/shared/store/preferences';

export type ReaderArtifactPayload = {
  node: ContentNode;
  artifact: RenderableArtifact;
};

export type ReaderArtifactQuery = ResourceQuery<ReaderArtifactPayload, RepositoryError>;

export function useReaderArtifactQuery(path: string): ReaderArtifactQuery {
  const repository = useContentRepository();
  const { locale } = usePreferences();
  const loadArtifact = useCallback(async () => {
    const resource = await repository.getRenderableArtifactByPath(path);

    if (resource.tag !== 'ready') {
      return resource;
    }

    return readyState<ReaderArtifactPayload, RepositoryError>({
      node: resource.value.node,
      artifact: resource.value.artifact,
    });
  }, [path, repository]);
  const queryKey = useMemo(() => ['artifact', locale, path] as const, [locale, path]);

  return useResourceQuery({
    queryKey,
    load: loadArtifact,
  });
}

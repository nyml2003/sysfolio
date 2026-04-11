import { useCallback, useMemo } from 'react';

import type { RenderableArtifactPayload, RepositoryError } from '@/entities/content';
import { useContentRepository } from '@/shared/data/repository';
import { useResourceQuery } from '@/shared/lib/query';
import type { ResourceState } from '@/shared/lib/resource/resource-state';
import { usePreferences } from '@/shared/store/preferences';

export function useRenderableArtifact(
  path: string
): ResourceState<RenderableArtifactPayload, RepositoryError> {
  const repository = useContentRepository();
  const { locale } = usePreferences();
  const loadRenderableArtifact = useCallback(
    () => repository.getRenderableArtifactByPath(path),
    [path, repository]
  );
  const queryKey = useMemo(() => ['artifact', locale, path] as const, [locale, path]);
  const query = useResourceQuery({
    queryKey,
    load: loadRenderableArtifact,
  });

  return query.resource;
}

import { useCallback, useMemo } from 'react';

import type { ContextInfo, RepositoryError } from '@/entities/content';
import { useContentRepository } from '@/shared/data/repository';
import { useResourceQuery, type ResourceQuery } from '@/shared/lib/query';
import { usePreferences } from '@/shared/store/preferences';

export type ReaderContextQuery = ResourceQuery<ContextInfo, RepositoryError>;

export function useReaderContextQuery(path: string): ReaderContextQuery {
  const repository = useContentRepository();
  const { locale } = usePreferences();
  const loadContextInfo = useCallback(
    () => repository.getContextInfoByPath(path),
    [path, repository]
  );
  const queryKey = useMemo(() => ['context', locale, path] as const, [locale, path]);

  return useResourceQuery({
    queryKey,
    load: loadContextInfo,
  });
}

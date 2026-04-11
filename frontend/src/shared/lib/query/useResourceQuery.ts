import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { detachPromise } from '@/shared/lib/async/detach-promise';
import { none, some } from '@/shared/lib/monads/option';
import { idleState, loadingState, type ResourceState } from '@/shared/lib/resource/resource-state';

import type { ResourceQuery } from './resource-query.types';

type UseResourceQueryOptions<T, E> = {
  queryKey: ReadonlyArray<string | number | boolean>;
  load: () => Promise<ResourceState<T, E>>;
  enabled?: boolean;
};

export function useResourceQuery<T, E>({
  queryKey,
  load,
  enabled = true,
}: UseResourceQueryOptions<T, E>): ResourceQuery<T, E> {
  const [resource, setResource] = useState<ResourceState<T, E>>(idleState());
  const [requestVersion, setRequestVersion] = useState(0);
  const [reloadToken, setReloadToken] = useState(0);
  const activeRequestVersionRef = useRef(0);
  const requestKey = useMemo(() => JSON.stringify(queryKey), [queryKey]);

  useEffect(() => {
    if (!enabled) {
      setResource(idleState());
      return undefined;
    }

    const nextRequestVersion = activeRequestVersionRef.current + 1;
    let disposed = false;

    activeRequestVersionRef.current = nextRequestVersion;
    setRequestVersion(nextRequestVersion);
    setResource(loadingState());

    const runQuery = async () => {
      const nextResource = await load();

      if (disposed || nextRequestVersion !== activeRequestVersionRef.current) {
        return;
      }

      startTransition(() => {
        setResource(nextResource);
      });
    };

    detachPromise(runQuery());

    return () => {
      disposed = true;
    };
  }, [enabled, load, reloadToken, requestKey]);

  const invalidate = useCallback(() => {
    setReloadToken((currentToken) => currentToken + 1);
  }, []);

  return {
    status: resource.tag,
    data: resource.tag === 'ready' ? some(resource.value) : none(),
    error: resource.tag === 'error' ? some(resource.error) : none(),
    resource,
    requestKey,
    requestVersion,
    reload: invalidate,
    retry: invalidate,
  };
}

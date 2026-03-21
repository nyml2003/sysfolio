import { startTransition, useEffect, useState } from "react";

import type { RenderableEntryPayload, RepositoryError } from "@/entities/content";
import { useContentRepository } from "@/shared/data/repository";
import { detachPromise } from "@/shared/lib/async/detach-promise";
import { idleState, loadingState, type ResourceState } from "@/shared/lib/resource/resource-state";
import { usePreferences } from "@/shared/store/preferences";

export function useRenderableEntry(
  path: string,
): ResourceState<RenderableEntryPayload, RepositoryError> {
  const repository = useContentRepository();
  const { locale } = usePreferences();
  const [resource, setResource] = useState<ResourceState<RenderableEntryPayload, RepositoryError>>(
    idleState(),
  );

  useEffect(() => {
    const abortController = new AbortController();
    const loadRenderableEntry = async () => {
      const nextResource = await repository.getRenderableEntryByPath(path);

      if (abortController.signal.aborted) {
        return;
      }

      startTransition(() => {
        setResource(nextResource);
      });
    };

    setResource(loadingState());
    detachPromise(loadRenderableEntry());

    return () => {
      abortController.abort();
    };
  }, [locale, path, repository]);

  return resource;
}

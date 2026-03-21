import { startTransition, useEffect, useState } from "react";

import type { RenderableEntryPayload, RepositoryError } from "@/entities/content";
import { useContentRepository } from "@/shared/data/repository";
import { idleState, loadingState, type ResourceState } from "@/shared/lib/resource/resource-state";

export function useRenderableEntry(
  path: string,
): ResourceState<RenderableEntryPayload, RepositoryError> {
  const repository = useContentRepository();
  const [resource, setResource] = useState<ResourceState<RenderableEntryPayload, RepositoryError>>(
    idleState(),
  );

  useEffect(() => {
    let cancelled = false;

    setResource(loadingState());
    void repository.getRenderableEntryByPath(path).then((nextResource) => {
      if (cancelled) {
        return;
      }

      startTransition(() => {
        setResource(nextResource);
      });
    });

    return () => {
      cancelled = true;
    };
  }, [path, repository]);

  return resource;
}

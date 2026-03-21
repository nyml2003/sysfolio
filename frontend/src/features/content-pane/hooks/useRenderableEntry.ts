import { startTransition, useEffect, useEffectEvent, useState } from "react";

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

  const loadEntry = useEffectEvent(async () => {
    setResource(loadingState());
    const nextResource = await repository.getRenderableEntryByPath(path);

    startTransition(() => {
      setResource(nextResource);
    });
  });

  useEffect(() => {
    void loadEntry();
  }, [loadEntry, path]);

  return resource;
}

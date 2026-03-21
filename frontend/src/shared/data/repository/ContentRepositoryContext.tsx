import { createContext, useContext } from "react";

import type { ContentRepository } from "./repository.types";

const ContentRepositoryContext = createContext<ContentRepository | null>(null);

export const ContentRepositoryProvider = ContentRepositoryContext.Provider;

export function useContentRepository(): ContentRepository {
  const repository = useContext(ContentRepositoryContext);

  if (repository === null) {
    throw new Error("ContentRepositoryContext is missing.");
  }

  return repository;
}

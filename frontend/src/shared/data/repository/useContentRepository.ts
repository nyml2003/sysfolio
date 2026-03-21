import { useContext } from "react";

import type { ContentRepository } from "./repository.types";
import { ContentRepositoryContext } from "./content-repository-context";

export function useContentRepository(): ContentRepository {
  const repository = useContext(ContentRepositoryContext);

  if (repository === null) {
    throw new Error("ContentRepositoryContext is missing.");
  }

  return repository;
}

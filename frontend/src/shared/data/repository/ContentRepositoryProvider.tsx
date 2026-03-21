import type { ReactNode } from "react";

import type { ContentRepository } from "./repository.types";
import { ContentRepositoryContext } from "./content-repository-context";

type ContentRepositoryProviderProps = {
  children: ReactNode;
  value: ContentRepository;
};

export function ContentRepositoryProvider({
  children,
  value,
}: ContentRepositoryProviderProps) {
  return (
    <ContentRepositoryContext.Provider value={value}>
      {children}
    </ContentRepositoryContext.Provider>
  );
}

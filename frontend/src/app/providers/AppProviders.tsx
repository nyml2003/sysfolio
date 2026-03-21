import { useState, type ReactNode } from "react";

import {
  ContentRepositoryProvider,
  createInMemoryContentRepository,
  type ContentRepository,
} from "@/shared/data/repository";
import { none, type Option, unwrapOr } from "@/shared/lib/monads/option";
import { PreferencesProvider } from "@/shared/store/preferences/PreferencesProvider";

type AppProvidersProps = {
  children: ReactNode;
  repository: Option<ContentRepository>;
};

export function AppProviders({ children, repository }: AppProvidersProps) {
  const [resolvedRepository] = useState<ContentRepository>(() =>
    unwrapOr(
      repository,
      createInMemoryContentRepository({
        latencyMs: none(),
      }),
    ),
  );

  return (
    <ContentRepositoryProvider value={resolvedRepository}>
      <PreferencesProvider>{children}</PreferencesProvider>
    </ContentRepositoryProvider>
  );
}

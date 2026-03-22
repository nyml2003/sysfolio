import { useMemo, type ReactNode } from 'react';

import { some } from '@/shared/lib/monads/option';
import type { ContentRepository } from './repository.types';
import { ContentRepositoryContext } from './content-repository-context';

type ContentRepositoryProviderProps = {
  children: ReactNode;
  value: ContentRepository;
};

export function ContentRepositoryProvider({ children, value }: ContentRepositoryProviderProps) {
  const contextValue = useMemo(() => some(value), [value]);

  return (
    <ContentRepositoryContext.Provider value={contextValue}>
      {children}
    </ContentRepositoryContext.Provider>
  );
}

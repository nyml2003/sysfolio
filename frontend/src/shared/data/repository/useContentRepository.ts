import { useContext } from 'react';

import { isSome } from '@/shared/lib/monads/option';

import type { ContentRepository } from './repository.types';
import { ContentRepositoryContext } from './content-repository-context';

export function useContentRepository(): ContentRepository {
  const repository = useContext(ContentRepositoryContext);

  if (!isSome(repository)) {
    throw new Error('ContentRepositoryContext is missing.');
  }

  return repository.value;
}

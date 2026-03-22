import { createContext } from 'react';

import { none, type Option } from '@/shared/lib/monads/option';

import type { ContentRepository } from './repository.types';

export const ContentRepositoryContext = createContext<Option<ContentRepository>>(none());

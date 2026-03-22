import { createContext } from 'react';

import { none, type Option } from '@/shared/lib/monads/option';
import type { ResolvedStyleContextValue } from '@/shared/lib/style/style.types';

export const StyleContext = createContext<Option<ResolvedStyleContextValue>>(none());

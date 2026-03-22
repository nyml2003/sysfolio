import { none, type Option } from '@/shared/lib/monads/option';

import type { ResourceState } from './resource-state.types';

export function emptyState<T, E>(reason: Option<string> = none()): ResourceState<T, E> {
  return { tag: 'empty', reason };
}

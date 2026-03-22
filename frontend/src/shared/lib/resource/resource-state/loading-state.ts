import type { ResourceState } from './resource-state.types';

export function loadingState<T, E>(): ResourceState<T, E> {
  return { tag: 'loading' };
}

import type { ResourceState } from './resource-state.types';

export function errorState<T, E>(error: E): ResourceState<T, E> {
  return { tag: 'error', error };
}

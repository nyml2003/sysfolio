import type { ResourceState } from './resource-state.types';

export function readyState<T, E>(value: T): ResourceState<T, E> {
  return { tag: 'ready', value };
}

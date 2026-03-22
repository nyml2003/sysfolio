import type { ResourceState } from './resource-state.types';

export function idleState<T, E>(): ResourceState<T, E> {
  return { tag: 'idle' };
}

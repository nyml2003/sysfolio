import type { Option } from '@/shared/lib/monads/option';

export type ResourceState<T, E> =
  | { tag: 'idle' }
  | { tag: 'loading' }
  | { tag: 'ready'; value: T }
  | { tag: 'empty'; reason: Option<string> }
  | { tag: 'error'; error: E };

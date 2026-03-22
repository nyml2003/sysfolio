import type { Option } from './option.types';
import { isSome } from './is-some';

export function match<T, U>(option: Option<T>, onNone: () => U, onSome: (value: T) => U): U {
  return isSome(option) ? onSome(option.value) : onNone();
}

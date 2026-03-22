import type { Option } from './option.types';
import { isSome } from './is-some';
import { none } from './none';

export function flatMap<T, U>(option: Option<T>, mapper: (value: T) => Option<U>): Option<U> {
  return isSome(option) ? mapper(option.value) : none();
}

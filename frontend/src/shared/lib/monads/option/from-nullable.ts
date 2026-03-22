import type { Option } from './option.types';
import { none } from './none';
import { some } from './some';

export function fromNullable<T>(raw: T | null | undefined): Option<T> {
  return raw === null || raw === undefined ? none() : some(raw);
}

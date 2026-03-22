import type { Option } from './option.types';

export function isSome<T>(option: Option<T>): option is { tag: 'some'; value: T } {
  return option.tag === 'some';
}

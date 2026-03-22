import type { Option } from './option.types';

export function isNone<T>(option: Option<T>): option is { tag: 'none' } {
  return option.tag === 'none';
}

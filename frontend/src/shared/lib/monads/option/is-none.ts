import type { Option, TNone } from './option.types';

export function isNone(option: Option<unknown>): option is TNone {
  return option.tag === 'none';
}

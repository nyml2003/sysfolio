import type { Option, TNone } from './option.types';

export const None: TNone = { tag: 'none' };

export function none(): Option<never> {
  return None;
}

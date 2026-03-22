import { ROOT_PATH } from './root-path';

export function pathFromSegments(segments: string[]): string {
  return segments.length === 0 ? ROOT_PATH : `/${segments.join('/')}`;
}

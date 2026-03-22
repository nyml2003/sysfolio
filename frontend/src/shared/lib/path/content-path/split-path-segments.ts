import { ROOT_PATH } from './root-path';
import { normalizePath } from './normalize-path';

export function splitPathSegments(path: string): string[] {
  const normalizedPath = normalizePath(path);

  return normalizedPath === ROOT_PATH
    ? []
    : normalizedPath
        .slice(1)
        .split('/')
        .filter((segment) => segment.length > 0);
}

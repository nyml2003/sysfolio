import { ROOT_PATH } from './root-path';
import { normalizePath } from './normalize-path';

export function isRootPath(path: string): boolean {
  return normalizePath(path) === ROOT_PATH;
}

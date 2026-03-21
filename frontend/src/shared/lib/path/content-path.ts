export const ROOT_PATH = "/";

export function normalizePath(rawPath: string): string {
  const basePath = rawPath.trim() === "" ? ROOT_PATH : rawPath.trim();
  const slashPrefixed = basePath.startsWith("/") ? basePath : `/${basePath}`;

  if (slashPrefixed === ROOT_PATH) {
    return ROOT_PATH;
  }

  return slashPrefixed.replace(/\/+$/, "");
}

export function splitPathSegments(path: string): string[] {
  const normalizedPath = normalizePath(path);

  return normalizedPath === ROOT_PATH
    ? []
    : normalizedPath
        .slice(1)
        .split("/")
        .filter((segment) => segment.length > 0);
}

export function pathFromSegments(segments: string[]): string {
  return segments.length === 0 ? ROOT_PATH : `/${segments.join("/")}`;
}

export function isRootPath(path: string): boolean {
  return normalizePath(path) === ROOT_PATH;
}

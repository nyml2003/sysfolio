import { ROOT_PATH } from "./root-path";

export function normalizePath(rawPath: string): string {
  const basePath = rawPath.trim() === "" ? ROOT_PATH : rawPath.trim();
  const slashPrefixed = basePath.startsWith("/") ? basePath : `/${basePath}`;

  if (slashPrefixed === ROOT_PATH) {
    return ROOT_PATH;
  }

  return slashPrefixed.replace(/\/+$/, "");
}

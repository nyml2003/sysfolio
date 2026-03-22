export function scheduleTimeout(callback: () => void, delayMs: number): number {
  return window.setTimeout(callback, delayMs);
}

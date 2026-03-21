export function scheduleTimeout(callback: () => void, delayMs: number): number {
  return window.setTimeout(callback, delayMs);
}

export function clearScheduledTimeout(timeoutId: number) {
  window.clearTimeout(timeoutId);
}

export function scheduleAnimationFrame(callback: FrameRequestCallback): number {
  return window.requestAnimationFrame(callback);
}

export function cancelScheduledAnimationFrame(frameId: number) {
  window.cancelAnimationFrame(frameId);
}

export function getPerformanceNow(): number {
  return window.performance.now();
}

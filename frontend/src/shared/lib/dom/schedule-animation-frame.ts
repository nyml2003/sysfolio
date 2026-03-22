export function scheduleAnimationFrame(callback: FrameRequestCallback): number {
  return window.requestAnimationFrame(callback);
}

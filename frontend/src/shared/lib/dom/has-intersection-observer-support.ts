export function hasIntersectionObserverSupport(): boolean {
  return typeof IntersectionObserver !== 'undefined';
}

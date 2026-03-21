export type TocReadingState =
  | "idle"
  | "initial"
  | "short_content"
  | "navigating"
  | "reading";

export const TOC_ACTIVATION_LINE_RATIO = 0.28;
export const TOC_BOTTOM_EPSILON = 4;
export const TOC_OBSERVER_BAND_HEIGHT = 4;
export const TOC_SCROLLABLE_EPSILON = 6;
export const TOC_TARGET_EPSILON = 6;
export const TOC_READING_PROGRESS_DEBOUNCE_MS = 180;
export const TOC_USER_SCROLL_IDLE_MS = 140;
export const TOC_NAVIGATING_TIMEOUT_MS = 2_000;

export function getElementScrollTopWithinContainer(
  scrollContainer: HTMLElement,
  element: HTMLElement,
): number {
  const containerRect = scrollContainer.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  return scrollContainer.scrollTop + elementRect.top - containerRect.top;
}

export function getTocActivationLine(scrollContainer: HTMLElement): number {
  return (
    scrollContainer.scrollTop +
    scrollContainer.clientHeight * TOC_ACTIVATION_LINE_RATIO
  );
}

export function getTocTargetScrollTop(
  scrollContainer: HTMLElement,
  element: HTMLElement,
): number {
  return Math.max(
    0,
    getElementScrollTopWithinContainer(scrollContainer, element) -
      scrollContainer.clientHeight * TOC_ACTIVATION_LINE_RATIO,
  );
}

export function hasScrollableTocContent(scrollContainer: HTMLElement): boolean {
  return (
    scrollContainer.scrollHeight - scrollContainer.clientHeight >
    TOC_SCROLLABLE_EPSILON
  );
}

export function isAtScrollBottom(scrollContainer: HTMLElement): boolean {
  return (
    scrollContainer.scrollTop + scrollContainer.clientHeight >=
    scrollContainer.scrollHeight - TOC_BOTTOM_EPSILON
  );
}

export function isTocTargetScrollReached(
  scrollContainer: HTMLElement,
  element: HTMLElement,
): boolean {
  return (
    Math.abs(scrollContainer.scrollTop - getTocTargetScrollTop(scrollContainer, element)) <=
      TOC_TARGET_EPSILON || isAtScrollBottom(scrollContainer)
  );
}

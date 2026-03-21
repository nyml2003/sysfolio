export type TocReadingState =
  | "idle"
  | "initial"
  | "short_content"
  | "navigating"
  | "reading";

export const TOC_ACTIVATION_LINE_RATIO = 0.28;
export const TOC_BOTTOM_EPSILON = 4;
export const TOC_SCROLLABLE_EPSILON = 6;
export const TOC_TARGET_EPSILON = 6;

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

export function getTocHeadingElements(scrollContainer: HTMLElement): HTMLElement[] {
  return Array.from(scrollContainer.querySelectorAll<HTMLElement>("[data-toc-id]"));
}

export function getFirstTocHeadingId(headings: HTMLElement[]): string {
  return headings[0]?.dataset.tocId ?? "";
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

export function getReadingActiveHeadingId(
  scrollContainer: HTMLElement,
  headings: HTMLElement[],
): string {
  if (headings.length === 0) {
    return "";
  }

  if (isAtScrollBottom(scrollContainer)) {
    return headings.at(-1)?.dataset.tocId ?? getFirstTocHeadingId(headings);
  }

  const activationLine = getTocActivationLine(scrollContainer);
  let currentHeading = headings[0];

  for (const heading of headings) {
    if (
      getElementScrollTopWithinContainer(scrollContainer, heading) <= activationLine
    ) {
      currentHeading = heading;
      continue;
    }

    break;
  }

  return currentHeading.dataset.tocId ?? getFirstTocHeadingId(headings);
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

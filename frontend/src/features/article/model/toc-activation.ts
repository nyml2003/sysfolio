export const TOC_ACTIVATION_LINE_RATIO = 0.28;
export const TOC_BOTTOM_EPSILON = 4;

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

export function isAtScrollBottom(scrollContainer: HTMLElement): boolean {
  return (
    scrollContainer.scrollTop + scrollContainer.clientHeight >=
    scrollContainer.scrollHeight - TOC_BOTTOM_EPSILON
  );
}

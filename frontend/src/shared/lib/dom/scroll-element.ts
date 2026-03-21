export function getElementScrollTop(element: HTMLElement): number {
  return element.scrollTop;
}

export function setElementScrollTop(element: HTMLElement, scrollTop: number) {
  element.scrollTop = scrollTop;
}

export function getElementClientHeight(element: HTMLElement): number {
  return element.clientHeight;
}

export function getElementScrollHeight(element: HTMLElement): number {
  return element.scrollHeight;
}

export function getElementScrollTopWithinContainer(
  scrollContainer: HTMLElement,
  element: HTMLElement,
): number {
  const containerRect = scrollContainer.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  return getElementScrollTop(scrollContainer) + elementRect.top - containerRect.top;
}

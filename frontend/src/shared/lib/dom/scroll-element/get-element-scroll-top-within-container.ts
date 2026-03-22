import { getElementScrollTop } from './get-element-scroll-top';

export function getElementScrollTopWithinContainer(
  scrollContainer: HTMLElement,
  element: HTMLElement
): number {
  const containerRect = scrollContainer.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  return getElementScrollTop(scrollContainer) + elementRect.top - containerRect.top;
}

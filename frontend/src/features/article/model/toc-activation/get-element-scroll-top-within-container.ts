import { getElementScrollTopWithinContainer as getDomElementScrollTopWithinContainer } from '@/shared/lib/dom/scroll-element';

export function getElementScrollTopWithinContainer(
  scrollContainer: HTMLElement,
  element: HTMLElement
): number {
  return getDomElementScrollTopWithinContainer(scrollContainer, element);
}

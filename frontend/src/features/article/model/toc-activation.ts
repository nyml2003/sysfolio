import {
  getElementClientHeight,
  getElementScrollHeight,
  getElementScrollTop,
  getElementScrollTopWithinContainer as getDomElementScrollTopWithinContainer,
} from "@/shared/lib/dom/scroll-element";
import {
  TOC_ACTIVATION_LINE_RATIO,
  TOC_BOTTOM_EPSILON,
  TOC_SCROLLABLE_EPSILON,
  TOC_TARGET_EPSILON,
} from "../constant";

export type TocReadingState =
  | "idle"
  | "initial"
  | "short_content"
  | "navigating"
  | "reading";

export function getElementScrollTopWithinContainer(
  scrollContainer: HTMLElement,
  element: HTMLElement,
): number {
  return getDomElementScrollTopWithinContainer(scrollContainer, element);
}

export function getTocActivationLine(scrollContainer: HTMLElement): number {
  return (
    getElementScrollTop(scrollContainer) +
    getElementClientHeight(scrollContainer) * TOC_ACTIVATION_LINE_RATIO
  );
}

export function getTocTargetScrollTop(
  scrollContainer: HTMLElement,
  element: HTMLElement,
): number {
  return Math.max(
    0,
    getElementScrollTopWithinContainer(scrollContainer, element) -
      getElementClientHeight(scrollContainer) * TOC_ACTIVATION_LINE_RATIO,
  );
}

export function hasScrollableTocContent(scrollContainer: HTMLElement): boolean {
  return (
    getElementScrollHeight(scrollContainer) - getElementClientHeight(scrollContainer) >
    TOC_SCROLLABLE_EPSILON
  );
}

export function isAtScrollBottom(scrollContainer: HTMLElement): boolean {
  return (
    getElementScrollTop(scrollContainer) + getElementClientHeight(scrollContainer) >=
    getElementScrollHeight(scrollContainer) - TOC_BOTTOM_EPSILON
  );
}

export function isTocTargetScrollReached(
  scrollContainer: HTMLElement,
  element: HTMLElement,
): boolean {
  return (
    Math.abs(getElementScrollTop(scrollContainer) - getTocTargetScrollTop(scrollContainer, element)) <=
      TOC_TARGET_EPSILON || isAtScrollBottom(scrollContainer)
  );
}
